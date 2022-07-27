const Product = require('./models/productModel')
const _ = require('lodash')
const express = require('express')
const dotenv = require('dotenv')
const connectToDb = require('./config/db')
dotenv.config({ path: './config/config.env' })
connectToDb()
const stripeUtil = require('./utils/stripe/Stripe')

const findAll = async () => {
  const lineItems = await stripeUtil.getLineItems(
    'cs_test_b1GzK6JYQ3HasVepR5Csu2N85LbaelOxwgND4kvYaeX77lZlmLoMTKsv5u'
  )

  const price = await stripeUtil.createPrice(2000,'blue velvet dress',{store:1234567890})

  console.log(price)

  //group products according to store
  // const result = _(products)
  //   .groupBy(x => x.store)
  //   .map((value, key) => ({ store: key, products: value }))
  //   .value()
  // console.log('result', result[0].products)
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
