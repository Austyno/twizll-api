const { Schema, model } = require('mongoose')

const favouriteSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'Buyer',
    },
    favourites: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
  },
  { timestamps: true }
)
module.exports = model('Favourite', favouriteSchema)
