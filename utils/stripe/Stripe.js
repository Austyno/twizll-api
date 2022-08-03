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
      let key = process.env.STRIPE_WEBHOOK_SECRET

      // if (process.env.NODE_ENV === 'development') {
      //   key = process.env.STRIPE_TEST_WEBHOK_SECRET
      // } else {
      //   key = process.env.STRIPE_WEBHOOK_SECRET
      // }
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
      const succesPath = path.join(__dirname, '../../public/success.ejs')
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

  createAccount(country) {
    return new Promise(async (resolve, reject) => {
      try {
        const account = await Stripe.accounts.create({
          type: 'custom',
          country,
          requested_capabilities: ['card_payments', 'transfers'],
        })
        resolve(account.id)
      } catch (e) {
        reject(e)
      }
    })
  }

  createAccountLink(accountId) {
    return new Promise(async (resolve, reject) => {
      try {
        const accountLink = await Stripe.accountLinks.create({
          account: accountId,
          type: 'custom_account_verification',
          collect: 'eventually_due',
          success_url:
            process.env.NODE_ENV === 'developement'
              ? `${process.env.DEV_ADDRESS}/?success`
              : `${process.env.PROD_ADDRESS}/?success`,
          failure_url:
            process.env.NODE_ENV === 'developement'
              ? `${process.env.DEV_ADDRESS}/?failed`
              : `${process.env.PROD_ADDRESS}/?failed`,
        })
        resolve(accountLink)
      } catch (e) {
        reject(e)
      }
    })
  }

  paymentIntent(amount, description, email) {
    return new Promise(async (resolve, reject) => {
      try {
        const intent = await Stripe.paymentIntents.create({
          amount,
          currency: 'gbp',
          description,
          receipt_email: email,
          automatic_payment_methods: {
            enabled: true,
          },
        })
        resolve(intent.client_secret)
      } catch (e) {
        reject(e)
      }
    })
  }

  // capturePayment(intentId) {
  //   return new Promise(async (resolve, reject) => {
  //     try {
  //       const capture = await Stripe.paymentIntents.capture(intentId)
  //       resolve(capture)
  //     } catch (e) {
  //       reject(e)
  //     }
  //   })
  // }

  createPrice(unit_price, metadata, product) {
    return new Promise(async (resolve, reject) => {
      try {
        const price = await Stripe.prices.create({
          unit_amount_decimal: unit_price,
          currency: 'gbp',
          metadata,
          product,
        })
        resolve(price)
      } catch (e) {
        reject(e)
      }
    })
  }

  createCheckoutSession(email, items) {
    return new Promise(async (resolve, reject) => {
      try {
        const session = await Stripe.checkout.sessions.create({
          customer_email: email,
          line_items: items,
          mode: 'payment',
          success_url:
            process.env.NODE_ENV === 'development'
              ? `${process.env.DEV_ADDRESS}/success`
              : `${process.env.PROD_ADDRESS}/success`,

          cancel_url:
            process.env.NODE_ENV === 'development'
              ? `${process.env.DEV_ADDRESS}/cancel`
              : `${process.env.PROD_ADDRESS}/cancel`,
        })
        // resolve(session.url)

        resolve(session)
      } catch (e) {
        reject(e.message)
      }
    })
  }

  getLineItems(sessionId) {
    return new Promise(async (resolve, reject) => {
      try {
        const session = await Stripe.checkout.sessions.retrieve(sessionId, {
          expand: ['line_items'],
        })

        resolve(session.line_items)
      } catch (e) {
        reject(e.message)
      }
    })
  }

  createProduct(data) {
    return new Promise(async (resolve, reject) => {
      try {
        const product = await Stripe.products.create({
          name: data.name,
          active: true,
          description: data.description,
          images: data.images,
        })
        resolve(product)
      } catch (e) {
        return reject(e)
      }
    })
  }
}
module.exports = new StripeUtil()
