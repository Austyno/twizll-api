const { Schema, model } = require('mongoose')

const orderItemSchema = new Schema(
  {
    orderID: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: 'Order',
    },
    productID: {
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
    quantity: {
      required: true,
      type: Number,
    },
    status:{
      type:String,
      enum:['pending','confirmed','cancelled'],
      default:'pending'
    }
  },
  {
    timestamps: true,
  }
)

orderItemSchema.index({ orderID: 1, productID: 1 })


module.exports = model('OrderItem', orderItemSchema)
