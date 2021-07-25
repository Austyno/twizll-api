const { Schema, model } = require('mongoose')

const bankDetailsSchema = new Schema({
  store: {
    type: Schema.Types.ObjectId,
    ref: 'Store',
  },
  bankName: {
    type: String,
    required: [true, 'Bank name not provided'],
    uppercase: true,
  },
  // bankCode: {
  //   type: String,
  //   required: [true, 'Bank code not provided'],
  // },
  accountNumber: {
    type: String,
    required: [true, 'Account number not provided'],
    validate(acc) {
      if (acc.length < 10) {
        throw new Error('Account number is invalid.')
      }
    },
    index: true,
  },
  accountName: {
    type: String,
    required: [true, 'Account name not provided'],
    uppercase: true,
  },
})

module.exports = model('BankDetails', bankDetailsSchema)
