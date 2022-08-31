const { Schema, model } = require('mongoose')

const styleSchema = new Schema(
  {
    stylist:{
      type:Schema.Types.ObjectId,
      ref:'Stylist'
    },
    name: {
      type: String,
      required: [true, 'Please provide a name for this style'],
    },
    collectionId: {
      type: Schema.Types.ObjectId,
      ref: 'TwizllCollection',
      required: [true, 'this style must belong to a collection'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description for this style'],
    },
    style_items: [{ ref: 'Product', type: Schema.Types.ObjectId }],
    price: {
      type: Number,
      required: [true, 'Please add a price for this style'],
    },
    views: {
      type: Number,
      default: 0,
    },
    numberSold: {
      type: Number,
      default: 0,
    },
  },

  { timestamps: true }
)
styleSchema.set('toObject', { virtuals: true })
module.exports = model('Style', styleSchema)
