const {Schema, model} = require('mongoose');

const walletSchema = new Schema({
  store: {
    type: Schema.Types.ObjectId,
    ref: 'Store',
    index: true
  },
  balance: {
    type: Schema.Types.Decimal128,
    default: '0.00'
  },
});

module.exports = model('Wallet', walletSchema)