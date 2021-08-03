const {Schema, model} = require('mongoose');

const transactionSchema = new Schema({
  store: {
    type: Schema.Types.ObjectId,
    ref: 'Store',
  },
  type: {
    type: String,
    lowercase: true,
    enum: [
      'payout',
      'withdrawal',
      'refund',
    ],
    required: true,
    uppercase: true,
  },
  status: {
    type: String,
    lowercase: true,
    enum: ['pending', 'successful', 'unsuccessful'],
    required: true,
    uppercase: true,
  },
  amount: {
    type: Schema.Types.Decimal128,
    required: true,
  },
  date_initiated: {
    type: Date,
    default: new Date(Date.now()),
  },
  date_completed: Date,
  title: {
    type: String,
    required: [true, `Title for this transaction not provided.`],
    uppercase: true,
  },
  tx_ref: String,
}, {timestamps: true});

transactionSchema.index({title: 1, store: 1})


module.exports = model('Transaction', transactionSchema);