const { model, Schema, Types } = require('mongoose')
// deals to be created by Admin and products added to the deal. make sure admin adds products to the deal.
// make sure admin does not add the same product twice
const dealsSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'please enter a title for this deal'],
    },
    percentageDiscount: {
      type: Number,
      required: [true, 'please enter a percentage discount for this deal'],
    },
    products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  },
  { timestamps:true }
)

dealsSchema.index({ products: 1 }, { unique: true })

module.exports = model('Deal', dealsSchema)
