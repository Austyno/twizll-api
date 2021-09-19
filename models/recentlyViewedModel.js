const { model, Schema } = require('mongoose')

const recentlyViewedSchema = new Schema(
  {
    viewedBy: {
      type:String,
    },
    product: {
      type: Schema.Types.ObjectId,
      required: [true, 'Please provide the id of the product'],
      ref: 'Product',
    },
  },
  {
    timestamps: true,
  }
)
recentlyViewedSchema.index({ viewedBy: 1, product: 1 }, { unique: true })

module.exports = model('RecentlyViwed', recentlyViewedSchema)
