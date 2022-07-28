const { model, Schema } = require('mongoose')

const twizlllWalletSchema = new Schema(
  {
    store: {
      type: Schema.Types.ObjectId,
      ref: 'Store',
      index: true,
    },
    amount: {
      type: Schema.Types.Decimal128,
    },
  },
  { timestamps: true }
)
module.exports = model('TwizllWallet', twizlllWalletSchema)
