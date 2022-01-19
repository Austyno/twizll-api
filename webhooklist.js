const stripe = require('stripe')(
  'sk_test_51H0RkNDPf3hBisiJlkGknCCyzzDhqymjc84C3pi8lBX0Ab4FzVccAx6Nzw2FDKFkqyozjuZqGqXF3nHx84wTUFWa00bQbyx23N'
)
const stripeUtil = require('./utils/stripe/Stripe')

const hook = async () => {
  // const webhookEndpoints = await stripe.webhookEndpoints.list({
  //   limit: 5,
  // })
  // console.log(webhookEndpoints)

  // const webhookEndpoint = await stripe.webhookEndpoints.create({
  //   url: 'http://127.0.0.1/api/stripe/webhook',
  //   enabled_events: [
  //     'customer.subscription.created',
  //     'checkout.session.completed',
  //   ],
  // })
  const lineItems = await stripeUtil.getLineItems(
    'cs_test_b10TrDMXXn7mgIUpHlbPhoJPzQbAklESiLxWTLSLfLQx8NRl5tMuwOi1Yn'
  )
  console.log('line items', lineItems.data[0].price)
}

// http://127.0.0.1/api/stripe/webhook
// '/v1/checkout/sessions/cs_test_b10TrDMXXn7mgIUpHlbPhoJPzQbAklESiLxWTLSLfLQx8NRl5tMuwOi1Yn/line_items'
hook()
