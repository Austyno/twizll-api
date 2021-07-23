const { model, Schema } = require('mongoose')

const OrderSchema = new Schema(
  {
    store: {
      type: Schema.Types.ObjectId,
      ref: 'Store',
      required: [true, 'Please provide the store this order belongs to'],
    },
    trackingId: {
      type: String,
    },
    buyer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'the buyer id is required'],
    },
    orderTotal: {
      type: Number,
      required: [true, 'please provide the order total'],
    },
    orderStatus: {
      type: String,
      enum: ['processing', 'shipped', 'arrived', 'delivered', 'completed'],
      default: 'new',
    },
    orderItems: {
      type: Array,
      required: true,
    },
    deliveryType: {
      type: String,
      enum: ['express', 'regular'],
    },
  },
  { timestamps: true }
)
OrderSchema.index({ trackingId: 1, orderStatus: 1, buyer: 1, store: 1 })

OrderSchema.pre('save', function () {
  this.trackingId = this._id
})

module.exports = model('Order', OrderSchema)
