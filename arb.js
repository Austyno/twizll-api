const Product = require('./models/productModel')
const _ = require('lodash')
const express = require('express')
const dotenv = require('dotenv')
const connectToDb = require('./config/db')
dotenv.config({ path: './config/config.env' })
connectToDb()
const stripeUtil = require('./utils/stripe/Stripe')
const Wallet = require('./models/walletModel')
const TwizllWallet = require('./models/twizllWallet')
const Trx = require('./models/transactionModel')

const findAll = async () => {
  const lineItems = await stripeUtil.getLineItems(
    'cs_test_b1tcFuYM0SDdIriD0h8HFx6pxJ0HRDdSWGIe1Ng9riesdzzAbfltIFdHLk'
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

  console.log(ObjMap)
  Object.keys(ObjMap).forEach(async store => {
    if (store != 'undefined') {
      const wallet = await Wallet.findOne({ store })
      if (wallet != null) {
        // cal 20% of total
        const seller_total =
          (Number(ObjMap[store]) - Number(ObjMap[store]) * 0.2) / 100
        const twizll_comm = (Number(ObjMap[store]) * 0.2) / 100
        wallet.balance = Number(wallet.balance + seller_total)
        wallet.save()
        //
        await TwizllWallet.create({ store, amount: twizll_comm })
        // create transaction
        await Trx.create({
          store,
          type: 'sale',
          status: 'successfull',
          amount: seller_total,
          title: 'sales of items',
        })
      }
      console.log(wallet)
    }
  })
}

//calculate store total
// let gTotal = []
// for (let x = 0; x < result.length; x++) {
//   for (let j = 0; j < result[x].products.length; j++) {
//     if (result[x].store.id == result[x].products[j].store.id) {
//       console.log(result[x].products[j].total)
//     }
//   }
// }
findAll()
