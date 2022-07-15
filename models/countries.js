const { model, Schema } = require('mongoose')

const countrySchema = new Schema(
  {
    name: {
      type: String,
      requred: true,
    },
    flag: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    dial_code: {
      type: String,
      required: true,
    },
  },
  {
    imestamps: true,
  }
)
module.exports = model('Country', countrySchema)
