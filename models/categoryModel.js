const { model, Schema } = require('mongoose')

const productCategorySchema = new Schema({
  name: {
    required: [true, 'Product Category name not provided'],
    type: String,
    unique: true,
  },
  briefDesc: {
    type: String,
  },
  mainPhoto: {
    type: String,
  },
  views: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  mainCategory: {
    type: Schema.Types.ObjectId,
    ref: 'MainCategory',
    required:[true, 'a main category is required']
  },
})

productCategorySchema.set('toObject', { virtuals: true })
productCategorySchema.set('toJSON', { virtuals: true })

productCategorySchema.index({ name: 1, briefDesc: 1 })

module.exports = model('Category', productCategorySchema)
