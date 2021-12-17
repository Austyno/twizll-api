const Error = require('../../utils/errorResponse')
const url = require('url')

const startSub = async (req, res, next) => {
  const { price } = req.body
  const user = req.user

  try {
    //format url with user stripe customer id and return
    const urlPath =
      process.env.NODE_ENV == 'production'
        ? process.env.PROD_ADDRESS
        : process.env.DEV_ADDRESS
    const urlLink = url.format({
      pathname: `${urlPath}/api/stripe/pay-sub`,
      query: {
        stripeid: user.stripe_customer_id,
        price: price,
        email: user.email,
      },
    })

    res.status(200).json({
      status: 'success',
      message: 'subscription link created successfully',
      data: urlLink,
    })
  } catch (e) {
    return next(new Error(e.message, 500))
  }
}
module.exports = startSub
