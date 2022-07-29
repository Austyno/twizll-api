const Product = require('./models/productModel')
const _ = require('lodash')
const dotenv = require('dotenv')
const connectToDb = require('./config/db')
dotenv.config({ path: './config/config.env' })
connectToDb()
const stripeUtil = require('./utils/stripe/Stripe')
const Wallet = require('./models/walletModel')
const TwizllWallet = require('./models/twizllWallet')
const Transaction = require('./models/transactionModel')

// TODO: 
// write a script that will take in all products in the database, 
// add metadata to each product price object and update the product with the new price id from stripe

const findAll = async () => {
  const lineItems = await stripeUtil.getLineItems(
    'cs_test_b1sVy9HGS5lWWWCNN2SMWHqcR1smwZ1RRvghuBNMgMQFQNfiuMvcfpioeA'
  )
  // await Trx.dropIndexes()

  let ObjMap = {}
  for (let item of lineItems.data) {
    let store = item.price.metadata.store
    if (!ObjMap[store]) {
      ObjMap[store] = 0
    }
    ObjMap[store] += item.amount_subtotal
  }

  Object.keys(ObjMap).forEach(async store => {
    if (store != 'undefined') {
      const wallet = await Wallet.findOne({ store })
      if (wallet) {
        // cal 20% of total
        const total = Number(ObjMap[store]) / 100
        const commission = (total * 0.2).toFixed(2)
        const seller_total = (total - commission).toFixed(2)
        const twizll_comm = commission
        wallet.balance = Number(wallet.balance) + Number(seller_total)
        wallet.save()
        //
        await TwizllWallet.create({ store, amount: twizll_comm })
        // create transaction
        await Transaction.create({
          store,
          type: 'sale',
          status: 'successful',
          amount: seller_total,
          title: 'sales of items',
        })
      }
    }
  })
}

findAll()
