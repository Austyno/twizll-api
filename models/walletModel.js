const { Schema, model } = require('mongoose')

const walletSchema = new Schema(
  {
    store: {
      type: Schema.Types.ObjectId,
      ref: 'Store',
      index: true,
    },
    style: {
      type: Schema.Types.ObjectId,
      ref: 'Stylist',
    },
    balance: {
      type: Schema.Types.Decimal128,
      default: '0.00',
    },
  },
  { timestamps: true }
)

module.exports = model('Wallet', walletSchema)
