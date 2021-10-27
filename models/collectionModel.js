const { model, Schema } = require('mongoose')

const twizllCollectionSchema = new Schema({
  name: {
    required: [true, 'Collection name not provided'],
    type: String,
    unique: true,
  },
  briefDesc: {
    type: String,
  },
  photo: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
})

twizllCollectionSchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'twizll_collection',
  justOne: false,
})

twizllCollectionSchema.set('toObject', { virtuals: true })
twizllCollectionSchema.set('toJSON', { virtuals: true })

twizllCollectionSchema.index({ name: 1 })

module.exports = model('TwizllCollection', twizllCollectionSchema)
