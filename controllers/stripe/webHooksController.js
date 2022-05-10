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
const axios = require('axios')

let checkoutSessionId = ''
let customer = ''
// a user adds their bank account we wneed to verify their account by requsting their BVN

const webHooks = async (req, res, next) => {
  try {
    const event = await stripeUtil.createWebhook(
      req.body,
      req.headers['stripe-signature']
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
        console.log('session ID', checkoutSessionId)
        // convert image from DHL base64 string to image.pdf
        // 1. convert base64 string to buffer
        // 2. convert buffer to image (write the image to pdf from base64 and save)

        //retrieve line items
        const lineItems = await stripeUtil.getLineItems(checkoutSessionId)
        // get order total
        let totals = []

        for (item of lineItems.data) {
          totals.push(item.amount_total)
        }

        const orderTotal = totals.reduce((a, b) => a + b)

        // create order
        const customerOrder = await Order.create({
          buyer: customer,
          shippingAddress: {
            address: customer.shippingAddress.address,
            country: customer.shippingAddress.country,
            contactPerson: customer.shippingAddress.contactPerson,
            city: customer.shippingAddress.city,
          },
          orderTotal: orderTotal,
        })

        //locate product and create order item
        for (item of lineItems.data) {
          const order_product = await Product.findOne({
            price_id: item.price.id,
          })

          const order_item = await OrderItem.create({
            orderId: customerOrder.id,
            product: order_product.id,
            quantity: item.quantity,
            totalPrice: item.amount_total,
          })

          //update customer orderitem with order_item.id
          await Order.updateOne(
            { _id: customerOrder.id },
            { $push: { orderItems: order_item.id } }
          )
        }

        const labels_for_seller = []

        //make a call to dhl get tracking id and label for each item
        for (pro of lineItems.data) {
          const product = await Product.findOne({ price_id: pro.price.id })
          // const label = await Dhl.createLabel(customer,product)
          const label = await Dhl.createLabel(
            customer,
            product,
            pro.quantity,
            customerOrder.id,
            pro.amount_total / 100
          )
          labels_for_seller.push(label)
        }

        console.log('labels :', labels_for_seller)
        // add tracking id to each order item.
        // email buyer a summary of items bought with tracking ids

        // update total sold for each product
        // email store owner items bought,label for each item and order id
        //group items based on store
        // calculate how much earned and update store wallet
        // create transaction
        //update buyer loyality points
        // res.send()
        break
      default:
      // console.log(`Unhandled event type ${event.type}`)
    }
    res.json({ received: true })
  } catch (e) {
    console.log(e)
    return next(new Error(e.message, 400))
  }
}

const checkoutSession = async (req, res, next) => {
  const { cartTotal, shippingAddress, cartItems } = req.body

  const buyer = req.user
  customer = req.user

  if (!buyer) {
    return next(
      new Error('You need to be logged in to perform this action', 403)
    )
  }
  try {
    const line_items = []

    for (let i = 0; i < cartItems.length; i++) {
      const prod = await Product.findById(cartItems[i].product)
      line_items.push({
        price: prod.price_id,
        quantity: cartItems[i].qty,
      })
    }

    const checkoutSession = await stripeUtil.createCheckoutSession(
      buyer.email,
      line_items
    )
    //save session id to use later to retrieve line items
    checkoutSessionId = checkoutSession.id

    res.status(200).json({
      status: 'success',
      message: 'check out session created',
      data: checkoutSession.url,
    })
  } catch (e) {
    return next(new Error(e, 500))
  }
}

module.exports = { webHooks, checkoutSession }
