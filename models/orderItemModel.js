const { Schema, model } = require('mongoose')

const orderItemSchema = new Schema(
  {
    orderId: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: 'Order',
    },
    product: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
    totalPrice: {
      required: true,
      type: Schema.Types.Decimal128,
    },
    discountedPrice: {
      type: Schema.Types.Decimal128,
      default: 0.0,
    },
    photo: {
      type: String,
    },
    qty: {
      required: true,
      type: Number,
    },
    attributes: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
)

orderItemSchema.index({ orderID: 1, productID: 1 },{unique:true})

module.exports = model('OrderItem', orderItemSchema)
