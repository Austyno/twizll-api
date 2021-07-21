const { Schema, model } = require('mongoose')

const StoreSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    required: [true, 'Please provide the id of the owner of this store'],
    ref: 'User',
  },

  storeName: {
    type: String,
    trim: true,
    required: [true, 'Please tell us your store name!'],
  },

  storeVisits: {
    type: Number,
    default: 0,
  },
  totalSales: {
    type: Number,
    default: 0,
  },
  totalOrders: {
    type: Number,
    default: 0,
  },
  totalReturns: {
    type: Number,
    default: 0,
  },
  docsUploaded: {
    type: Boolean,
    default: false,
  },
  storeVerified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
})
StoreSchema.set('toObject', { virtuals: true })
StoreSchema.set('toJSON', { virtuals: true })

StoreSchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'store',
  justOne: false,
})

module.exports = model('Store', StoreSchema)