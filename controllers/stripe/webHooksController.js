const Error = require('../../utils/errorResponse')
const stripeUtil = require('../../utils/stripe/Stripe')
const Seller = require('../../models/sellerModel')
const moment = require('moment')
const Buyer = require('../../models/buyerModel')
const Product = require('../../models/productModel')
const Store = require('../../models/storeModel')

let checkoutSessionId = ''

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


        //retrieve line items
        const lineItems = await stripeUtil.getLineItems(checkoutSessionId)
        console.log('line items', lineItems.data[0].price)
        //make a call to dhl get tracking id and label for each item
        // email buyer a summary of items bought with tracking ids
        // create order
        // email store owner items bought,label for each item and order id
        //group items based on store
        // calculate how much earned and update store wallet
        // create transaction
        res.send()
        break
      default:
        console.log(`Unhandled event type ${event.type}`)
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

  if (!buyer) {
    return next(
      new Error('You need to be logged in to perform this action', 403)
    )
  }
  try {
    const line_items = []
    // const metadata = { }

    for (let i = 0; i < cartItems.length; i++) {
      const prod = await Product.findById(cartItems[i].product)
      line_items.push({
        price: prod.price_id,
        quantity: cartItems[i].qty,
      })
      // metadata.productId = prod.price_id
    }

    const checkoutSession = await stripeUtil.createCheckoutSession(
      buyer.email,
      line_items,
    )
    //save session id to use later to retrieve line items
    checkoutSessionId = checkoutSession.id

    res.status(200).json({
      status: 'success',
      message: 'check out session created',
      data: checkoutSession.url,
    })
  } catch (e) {
    console.log(e)
    return next(new Error(e, 500))
  }
}

module.exports = { webHooks, checkoutSession }
