const { model, Schema } = require('mongoose')
const promoSchema = new Schema(
  {
    code: {
      type: String,
      required: [true, 'Promo code not provided.'],
      unique: true,
    },
    valid: {
      type: Boolean,
      default: true,
    },
    expiry_date: {
      required: [true, 'Expiry date not provided.'],
      type: Date,
    },
    discount_type: {
      enum: ['PERCENT', 'GROSS'],
      default: 'PERCENT',
      type: String,
    },
    discount: {
      required: [true, 'Discount not provided.'],
      type: Number,
    },
    target: {
      type: Schema.Types.Mixed,
      required: [true, 'Promo target not specified.'],
      default: '*',
    },
    title: {
      required: [true, 'Title is required.'],
      type: String,
    },
  },
  { timestamps: true }
)

promoSchema.index({ title: 1, code: 1 })

promoSchema.methods.toJSON = function () {
  const promoObject = this.toObject()
  delete promoObject.__v
  return promoObject
}

promoSchema.set('toObject', {
  transform: function (doc, ret, opt) {
    ret['discount'] = Number(String(ret['discount']))
    delete ret['__v']
    return ret
  },
})

module.exports = model('Promo', promoSchema)
