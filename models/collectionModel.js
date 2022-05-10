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
  collectionCategory: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
  collectionSubCategory: [{ type: Schema.Types.ObjectId, ref: 'SubCategory' }],
  collectionProducts: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
})

twizllCollectionSchema.index({ name: 1 })

module.exports = model('TwizllCollection', twizllCollectionSchema)
