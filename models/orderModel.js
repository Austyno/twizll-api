const { model, Schema } = require('mongoose')

const OrderSchema = new Schema(
  {
    storeId: {
      type: Schema.Types.ObjectId,
      ref: 'Store',
      required: [true, 'Please provide the store this order belongs to'],
    },
    trackingId: {
      type: String,
    },
    buyerId: {
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
      enum: ['delivered', 'processing', 'shipped', 'arrived', 'completed'],
      default:'processing'
    },
    orderItems: {
      type: Array,
      required: true,
    },
    deliveryType:{
      type:String,
      enum:['express','regular']
    }
  },
  { timestamps: true }
)

OrderSchema.pre('save',function(){
  this.trackingId = this._id
})

module.exports = model('Order', OrderSchema)
