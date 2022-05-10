const { Schema, model } = require('mongoose')

const collectionCatSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'please enter the name of this collection category'],
    },
    collections: [
      {
        type: Schema.Types.ObjectId,
        ref: 'TwizllCollection',
      },
    ],
    image: {
      type: String,
      required: [true, 'please add an image for this category'],
    },
  },
  {
    timestamps: true,
  }
)
module.exports = model('CollectionCategory', collectionCatSchema)
