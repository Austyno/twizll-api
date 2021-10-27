const { model, Schema } = require('mongoose')

const subCategorySchema = new Schema({
  name: {
    required: [true, 'Product  sub Category name not provided'],
    type: String,
    unique: true,
  },
  parentCategory:{
    type: Schema.Types.ObjectId,
    ref:'Category'
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
module.exports = model('Subcategory', subCategorySchema)