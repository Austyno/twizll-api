const { model, Schema, Types } = require('mongoose')
// Note: every 20 pounds = 1 point
//every 100 points = 2 pounds

const loyalitySchema = new Schema({
  buyer: {
    type: Schema.Types.ObjectId,
    ref: 'Buyer',
    required: [true, 'the buyer id is required'],
  },
  points: {
    type: Number,
    default: 0,
  },
})
module.exports = model('LoyalityPoint', loyalitySchema)
