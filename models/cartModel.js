const { Schema, model } = require('mongoose')

const cartItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity can not be less than 1.'],
  },
  totalPrice: { type: Schema.Types.Decimal128, default: '0.00' },
  discountedPrice: { type: Schema.Types.Decimal128, default: '0.00' },
})

cartItemSchema.methods.toJSON = function () {
  const cartItemObject = this.toObject()
  delete cartItemObject.__v
  cartItemObject.totalPrice = Number(String(cartItemObject.totalPrice))
  cartItemObject.discountedPrice = Number(
    String(cartItemObject.discountedPrice)
  )
  return cartItemObject
}

cartItemSchema.set('toObject', {
  transform: function (doc, ret, opt) {
    ret['totalPrice'] = Number(String(ret['totalPrice']))
    ret['discountedPrice'] = Number(String(ret['discountedPrice']))
    delete ret['__v']
  },
})

const cartSchema = new Schema(
  {
    _owner: {
      ref: 'Customer',
      type: Schema.Types.ObjectId,
      index: true,
      unique: true,
      sparse: true,
    },
    cartItems: [cartItemSchema],
    totalPrice: {
      type: Schema.Types.Decimal128,
      default: 0,
    },
    discountedPrice: {
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

cartSchema.methods.toJSON = function () {
  const cartObject = this.toObject()
  delete cartObject.__v
  cartObject['totalPrice'] = Number(String(cartObject['totalPrice']))
  cartObject['discountedPrice'] = Number(String(cartObject['discountedPrice']))
  return cartObject
}

cartSchema.set('toObject', {
  transform: function (doc, ret, opt) {
    ret['totalPrice'] = Number(String(ret['totalPrice']))
    ret['discountedPrice'] = Number(String(ret['discountedPrice']))
    delete ret['__v']
  },
})

module.exports = model('Cart', cartSchema)
