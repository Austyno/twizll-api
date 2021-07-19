const { model, Schema } = require('mongoose')

const productCategorySchema = new Schema(
  {
    name: {
      required: [true, 'Product Category name not provided'],
      type: String,
      unique: true,
    },
    briefDetails: String,
    mainPhoto: String,
  },
  {
    timestamps: true,
  }
)

productCategorySchema.index({ name: 1, briefDetails: 1 })


module.exports = model('ProductCategory', productCategorySchema)
