const { model, Schema } = require('mongoose')


const OrderSchema = new Schema(
  {
    buyer: {
      type: Schema.Types.ObjectId,
      ref: 'Buyer',
      required: [true, 'the buyer id is required'],
    },
    trackingId: {
      type: String,
    },
    orderTotal: {
      type: Number,
      required: [true, 'please provide the order total'],
    },
    orderStatus: {
      type: String,
      enum: ['new', 'shipped', 'delivered', 'cancelled', 'confirmed'],
      default: 'new',
    },
    orderItems: [{ ref: 'OrderItem', type: Schema.Types.ObjectId }],
    shippingAddress: {
      type: String,
    },
    shippedDate: {
      type: Date,
    },
    paymentRef: {
      type: String,
    },
    deliveryType: {
      type: String,
      enum: ['express', 'regular'],
      default:'regular'
    },
  },
  { timestamps: true }
)
OrderSchema.index({ trackingId: 1, buyer: 1, store: 1 },{unique:true})

OrderSchema.pre('save', function () {
  //tracking id will be given by shipping company. this is temp for now
  this.trackingId = this._id
})

module.exports = model('Order', OrderSchema)
