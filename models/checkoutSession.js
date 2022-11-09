const { model, Schema } = require('mongoose')

const checkoutSessionSchema = new Schema(
  {
    session_id: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    styleID: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
)
module.exports = model('CheckoutSession', checkoutSessionSchema)
