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
    'cs_test_a1JXt973NVWsl9Utt6aGQLgwQzl957HuR5Joh3Ci1ms2JWCA2q1v0UG0Ei'
  )
  // await Trx.dropIndexes()
  console.log(lineItems.data[0].price)

  let ObjMap = {}
  for (let item of lineItems.data) {
    let store = item.price.metadata.store
    if (!ObjMap[store]) {
      ObjMap[store] = 0
    }
    ObjMap[store] += item.amount_subtotal
  }

  // Object.keys(ObjMap).forEach(async store => {
  //   if (store != 'undefined') {
  //     const wallet = await Wallet.findOne({ store })
  //     if (wallet) {
  //       // cal 20% of total
  //       const total = Number(ObjMap[store]) / 100
  //       const commission = (total * 0.2).toFixed(2)
  //       const seller_total = (total - commission).toFixed(2)
  //       const twizll_comm = commission
  //       wallet.balance = Number(wallet.balance) + Number(seller_total)
  //       wallet.save()
  //       //
  //       await TwizllWallet.create({ store, amount: twizll_comm })
  //       // create transaction
  //       await Transaction.create({
  //         store,
  //         type: 'sale',
  //         status: 'successful',
  //         amount: seller_total,
  //         title: 'sales of items',
  //       })
  //     }
  //   }
  // })

  // const stripe = require('stripe')(
  //   'sk_test_51H0RkNDPf3hBisiJlkGknCCyzzDhqymjc84C3pi8lBX0Ab4FzVccAx6Nzw2FDKFkqyozjuZqGqXF3nHx84wTUFWa00bQbyx23N'
  // )

  // // const product = await stripe.products.create({
  // //   name: ' Special velvet dress2',
  // //   active: true,
  // //   description: 'beutiful velvet dress for special occations',

  // //   metadata: { store: '60f856cce5fc4a233adb5263' },
  // //   images: [
  // //     'https://res.cloudinary.com/dq59gbro3/image/upload/v1658962879/shop/tmp-4-1658962830893_arhnlw.jpg',
  // //     'https://res.cloudinary.com/dq59gbro3/image/upload/v1658962879/shop/tmp-5-1658962852061_nzdxib.jpg',
  // //   ],
  // //   // default_price: 'price_1LSYBtDPf3hBisiJrggiCt4i',
  // // })
  // // const product = await stripe.products.update('prod_MAva8acVB2dVf7', {
  // //   default_price: 'price_1LSX6jDPf3hBisiJVKd03RVv',
  // // })
  // const price = await stripe.prices.create({
  //   unit_amount: 3500,
  //   currency: 'gbp',
  //   metadata: { store: '60f856cce5fc4a233adb5263' },
  //   product_data: {
  //     name: 'Special velvet dress3',
  //     images: [
  //       'https://res.cloudinary.com/dq59gbro3/image/upload/v1658962879/shop/tmp-5-1658962852061_nzdxib.jpg',
  //     ],
  //   },
  // })
  // console.log(price)
}
findAll()
