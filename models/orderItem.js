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
    quantity: {
      required: true,
      type: Number,
    },
    totalPrice: {
      required: true,
      type: Schema.Types.Decimal128,
    },
    discountedPrice: {
      type: Schema.Types.Decimal128,
      default: 0.0,
    },
    tracking_id: {
      type: String,
    },
    status: {
      type: String,
      enum: [
        'new',
        'confirmed',
        'cancelled',
        'completed',
        'shipped',
        'delivered',
      ],
      default: 'new',
    },
  },
  {
    timestamps: true,
  }
)

orderItemSchema.index({ orderID: 1, productID: 1 })

module.exports = model('OrderItem', orderItemSchema)
