//frontend
//1.user clicks on "activate plan"
//2.make an async post request to /subscribe endpoint with {price:price_1JPJ8RDPf3hBisiJtwxWIWsC}
//3.in the ".then" the  billing session id is returned, use it to immediately make a checkout request to stripe for payment

//backend
//get price code from req.body,locate client and get stripe id
//make a call to stripe and create billing session(this will pre populate the checkout form with customer info)
//send billing session id to the frontend
//listen for webhook info and update db

const Error = require('../../utils/errorResponse')
const stripeUtil = require('../../utils/stripe/Stripe')
const User = require('../../models/userModel')
const moment = require('moment')

const createSubscription = async (req, res, next) => {
  const {price} = req.body
  const user = req.user

  try{
    const subSession = await stripeUtil.createSubscriptionSession(
      user.stripe_customer_id,
      price,
      user.email
    )

    res.status(200).json({
      status: 'success',
      sessionId: subSession.id,
    })
  }catch(e){
    return next(new Error(e.message,500))
  }

}

module.exports = createSubscription
