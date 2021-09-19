const stripe = require('stripe')
const path = require('path')
const Stripe = stripe(
  'sk_test_51H0RkNDPf3hBisiJlkGknCCyzzDhqymjc84C3pi8lBX0Ab4FzVccAx6Nzw2FDKFkqyozjuZqGqXF3nHx84wTUFWa00bQbyx23N'
)

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
        const event = await Stripe.webhooks.constructEvent(rawBody, sig, key)
        resolve(event)
      } catch (e) {
        reject(e)
      }
    })
  }

  createSubscriptionSession(customerID, price, email) {
    return new Promise(async (resolve, reject) => {
      const domain =
        process.env.NODE_ENV === 'production'
          ? process.env.PROD_ADDRESS
          : process.env.DEV_ADDRESS
      const succesPath = path.join(__dirname,'../../public/success.ejs')
      try {
        const subscription = await Stripe.subscriptions.create({
          customer: customerID,
          items: [
            {
              price,
            },
          ],
          payment_behavior: 'default_incomplete',
          expand: ['latest_invoice.payment_intent'],
        })
        resolve(subscription)
      } catch (e) {
        reject(e)
      }
    })
  }
}

module.exports = new StripeUtil()
