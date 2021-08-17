const stripe = require('stripe')
const Stripe = stripe(process.env.STRIPE_SECRET_KEY)

class StripeUtil {
  //create new customer
  addNewCustomer(email) {
    return new Promise(async (resolve, reject) => {
      try {
        const customer = await Stripe.customers.create({
          email,
          description: 'New Customer',
        })
        resolve(customer)
      } catch (e) {
        reject(e)
      }
    })
  }

  //get a customer by stripe customer id
  getCustomerByID(id) {
    return new Promise(async (resolve, reject) => {
      try {
        const customer = await Stripe.customers.retrieve(id)
        resolve(customer)
      } catch (e) {
        reject(e)
      }
    })
  }

  createWebhook(rawBody, sig) {
    return new Promise(async (resolve, reject) => {
      let key = ''

      if (process.env.NODE_ENV === 'development') {
        key = process.env.STRIPE_TEST_WEBHOK_SECRET
      } else {
        key = process.env.STRIPE_WEBHOOK_SECRET
      }
      try {
        const event = await Stripe.webhooks.constructEvent(
          rawBody,
          sig,
          key
        )
        resolve(event)
      } catch (e) {
        reject(e)
      }
    })
  }

  createSubscriptionSession(customerID, price) {
    return new Promise(async (resolve, reject) => {
      try {
        const session = await Stripe.checkout.sessions.create({
          mode: 'subscription',
          payment_method_types: ['card'],
          customer: customerID,
          line_items: [
            {
              price,
              quantity: 1,
            },
          ],
          success_url: `${process.env.DEV_DOMAIN}?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${process.env.DEV_DOMAIN}`,
        })
        resolve(session)
      } catch (e) {
        reject(e)
      }
    })
  }
}

module.exports = new StripeUtil()
