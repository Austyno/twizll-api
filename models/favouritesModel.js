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
    favourite_styles: [{ type: Schema.Types.ObjectId, ref: 'Style' }],
  },
  { timestamps: true }
)
module.exports = model('Favourite', favouriteSchema)
