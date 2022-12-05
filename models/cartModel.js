const { Schema, model } = require('mongoose')

const cartItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
  },
  qty: {
    type: Number,
    required: true,
    min: [1, 'Quantity can not be less than 1.'],
  },
  total: { type: Schema.Types.Decimal128, default: '0.00' },
  // discountedPrice: { type: Schema.Types.Decimal128, default: '0.00' },
})

const cartSchema = new Schema(
  {
    owner: {
      ref: 'Buyer',
      type: Schema.Types.ObjectId,
      index: true,
    },
    cartItems: [cartItemSchema],
    cartTotal: {
      type: Schema.Types.Decimal128,
      default: 0,
    },
    cartDiscount: {
      type: Schema.Types.Decimal128,
      default: 0,
    },
    promoCode: {
      type: Schema.Types.ObjectId,
      ref: 'Promo',
    },
  },
  {
    timestamps: true,
  }
)

module.exports = model('Cart', cartSchema)
