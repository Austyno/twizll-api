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
twizllCollectionSchema.set('toObject', { virtuals: true })
twizllCollectionSchema.set('toJSON', { virtuals: true })

twizllCollectionSchema.virtual('styles', {
  ref: 'Style',
  localField: '_id',
  foreignField: 'collectionId',
  justOne: false,
})

twizllCollectionSchema.index({ name: 1 })

module.exports = model('TwizllCollection', twizllCollectionSchema)
