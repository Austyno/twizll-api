const { Schema, model } = require('mongoose')

const collectionProduct = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'please add a product'],
    },
    collectionCategories: [
      {
        type: Schema.Types.ObjectId,
        ref: 'CollectionCategory',
        required: [true, 'collection category ID is required'],
      },
    ],
  },
  { timestamps: true }
)
module.exports = model('CollectionProduct', collectionProduct)
