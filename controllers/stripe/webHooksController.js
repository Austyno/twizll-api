const Error = require('../../utils/errorResponse')
const stripUtil = require('../../utils/stripe/Stripe')
const User = require('../../models/userModel')
const moment = require('moment')

const webHooks = async (req, res, next) => {
  try {
    const event = await stripUtil.createWebhook(
      req.body,
      req.headers['stripe-signature']
    )
    
    const data = event.data.object


    switch (event.type) {
      case 'customer.subscription.created':
        //locate user and update info based on returned info from stripe after subscription
        const user = await User.findOne({ stripe_customer_id: data.customer })

        // user.free_trial.status = 'completed'
        // user.plan.status = data.status
        // user.plan.type = data.plan.interval
        // user.plan.start_date = moment(data.current_period_start)
        // user.plan.end_date = moment(data.current_period_end)
        // res.json({ received: true })
        // await user.save()
        console.log('user updated')
        break
      default:
    }
    res.json({ received: true })
  } catch (e) {
    console.log(e)
    return next(new Error(e.message, 400))
  }
}

module.exports = webHooks