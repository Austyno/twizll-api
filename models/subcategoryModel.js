const { model, Schema } = require('mongoose')

const subCategorySchema = new Schema({
  name: {
    required: [true, 'Product  sub Category name not provided'],
    type: String,
    unique: true,
  },
  parentCategory: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
  },
  briefDesc: {
    type: String,
  },
  photo: {
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
})

subCategorySchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'sub_category',
  justOne: false,
})

module.exports = model('SubCategory', subCategorySchema)
