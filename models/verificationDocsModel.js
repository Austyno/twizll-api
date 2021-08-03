const { Schema, model } = require('mongoose')

const verificationSchema = new Schema(
  {
    store: {
      type: Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
    },
    proofOfId: {
      type: String,
      default: null,
    },
    proofOfAddress: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = model('VerificationDoc', verificationSchema)
