const sendMail = require('../../utils/sendMail')
const Error = require('../../utils/errorResponse')
const stripeUtil = require('../../utils/stripe/Stripe')
const Seller = require('../../models/sellerModel')
const moment = require('moment')
const Buyer = require('../../models/buyerModel')
const Product = require('../../models/productModel')
const Store = require('../../models/storeModel')
const Dhl = require('../../utils/dhl/Dhl')
const Order = require('../../models/orderModel')
const OrderItem = require('../../models/orderItem')
const Wallet = require('../../models/walletModel')
const TwizllWallet = require('../../models/twizllWallet')
const Transaction = require('../../models/transactionModel')
const CheckoutSession = require('../../models/checkoutSession')
const Style = require('../../models/styleModel')
const fs = require('fs')
const path = require('path')

// a user adds their bank account we wneed to verify their account by requsting their BVN

const webHooks = async (req, res, next) => {
  try {
    const event = await stripeUtil.createWebhook(
      req.body,
      req.headers['stripe-signature'],
      'whsec_MtXUs0yI6NUSd3PLRNTHcOfksu7w32k7'
    )
    const data = event.data.object

    switch (event.type) {
      case 'customer.subscription.created':
        //locate user and update info based on returned info from stripe after subscription
        const user = await Seller.findOne({ stripe_customer_id: data.customer })

        user.free_trial.status = 'completed'
        user.plan.status = data.status
        user.plan.type = data.plan.interval
        user.plan.start_date = moment(data.current_period_start)
        user.plan.end_date = moment(data.current_period_end)
        res.json({ received: true })
        await user.save({ validateBeforeSave: false })

        break
      case 'checkout.session.completed':
        console.log(event.data.object.id)

        const checkout_session = await CheckoutSession.findOne({
          session_id: event.data.object.id,
        })
        const customer = await Buyer.findOne({ email: checkout_session.email })

        // Retrieve style
        if(checkout_session.styleID != ''){
          const style = await Style.findById(checkout_session.styleID)
        }

        //retrieve line items
        const lineItems = await stripeUtil.getLineItems(
          checkout_session.session_id
        )
        // get order total
        let totals = []

        for (item of lineItems.data) {
          totals.push(item.amount_subtotal)
        }

        //get order toatl to ceate order
        const orderTotal = totals.reduce((a, b) => a + b)

        // create order
        const customerOrder = await Order.create({
          buyer: customer.id,
          shippingAddress: {
            address: customer.shippingAddress.address,
            country: customer.shippingAddress.country,
            contactPerson: customer.shippingAddress.contactPerson,
            city: customer.shippingAddress.city,
          },
          orderTotal: orderTotal,
        })

        const labels_for_seller = []
        const buyer_tracking_ids = []

        //locate product and create order item
        for (item of lineItems.data) {
          const order_product = await Product.findOne({
            price_id: item.price.id,
          })

          //update product qty and number sold
          await Product.findOneAndUpdate(
            { _id: order_product.id },
            {
              $set: {
                numberSold:
                  Number(order_product.numberSold) + Number(item.quantity),
                availableQty:
                  Number(order_product.availableQty) - Number(item.quantity),
              },
            }
          )

          //get labels for each product from dhl
          const dhl = await Dhl.createLabel(
            customer,
            order_product,
            item.quantity,
            customerOrder.id,
            item.amount_subtotal / 100
          )

           //split product name to use in pdf naming so seller can recognize each pdf
          const label_pdf_name = order_product.name.split(' ').join('_')

          //convert blob data from DHL to pdf
          const label_pdf = fs.writeFile(
            path.join(__dirname, '../../pdfLabels/' + `${label_pdf_name}.pdf`),
            dhl.label,
            'base64',
            error => {
              if (error) {
                throw error
              }
              console.log('pdf saved')
            }
          )

          labels_for_seller.push(label_pdf)
          if (dhl.trackingId) {buyer_tracking_ids.push(dhl.trackingId)}

          console.log(labels_for_seller)
          console.log(buyer_tracking_ids)

          //create order items in db with each product
          const order_item = await OrderItem.create({
            orderId: customerOrder.id,
            product: order_product.id,
            quantity: item.quantity,
            totalPrice: item.amount_subtotal,
            tracking_id: dhl.trackingId,
          })

          //update customer order with order_item id
          await Order.findOneAndUpdate(
            { _id: customerOrder.id },
            { $push: { orderItems: order_item.id } }
          )
        }

        //group products according to store and calculate earnings
        let ObjMap = {}
        for (let item of lineItems.data) {
          let store = item.price.metadata.store
          if (!ObjMap[store]) {
            ObjMap[store] = 0
          }
          ObjMap[store] += item.amount_subtotal
        }

        //map through the store ids, update store wallets with earned amount
        Object.keys(ObjMap).forEach(async store => {
          const wallet = await Wallet.findOne({ store })
          if (wallet) {
            // cal 20% of total
            const total = Number(ObjMap[store]) / 100
            const commission = (total * 0.2).toFixed(2)
            const seller_total = (total - commission).toFixed(2)
            const twizll_comm = commission
            wallet.balance = Number(wallet.balance) + Number(seller_total)
            wallet.save()
            //
            await TwizllWallet.create({ store, amount: twizll_comm })
             // create transaction
            await Transaction.create({
              store,
              type: 'sale',
              status: 'successful',
              amount: seller_total,
              title: 'sales of items',
            })
          }
          //check if style exist on the session and calculate commission for stylist (5%)
        })

        //email buyer
        const product_summary = []

        const buyer_order_items = await OrderItem.find({ orderId: customerOrder.id})



        for (let item of buyer_order_items) {
          const product = await Product.findOne({ _id: buyer_order_items.product })
          product_summary.push({ product, qty: buyer_order_items.quantity })
        };

        //refactor so we can get the quantity for each product and email along
        const order_summary = {
          order_total: orderTotal,
          products: product_summary,
          fullName: customer.fullName,
        }

        //send buyer email
        await sendMail.withTemplate(
          product_summary,
          customer.email,
          '/buyer-order.ejs',
          'Your order summary'
        )
        //send seller email
        await sendMail.withTemplate(
          product_summary,
          customer.email,
          '/new-order.ejs',
          'New order'
        )
        // add tracking id to each order item.
        // email buyer a summary of items bought with tracking ids
        // update total sold for each product
        // email store owner items bought,label for each item and order id
        //group items based on store
        // calculate how much earned and update store wallet
        // create transaction
        //update buyer loyality points
        res.send()
        break
      default:
      // console.log(`Unhandled event type ${event.type}`)
    }
    return res.json({ received: true })
  } catch (e) {
    console.log(e)
    return next(e)
  }
}

module.exports = webHooks
