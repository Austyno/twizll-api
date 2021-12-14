const Error = require('../../utils/errorResponse')
const Buyer = require('../../models/buyerModel')
const Seller = require('../../models/sellerModel')
const Product = require('../../models/productModel')
const Store = require('../../models/storeModel')
const _ = require('lodash')

const checkOut = async (req, res, next) => {
  //get checkout payload
  //group payload according to store
  //inspect payload and get individual products store, check if they have active subscription and are verified
  //check if available qty is greater than payload qty for each item
  //group items according to store
  //calculate total amout for each store and deduct service charge (20%)
  //check if store has an account id from stripe
  //No. attacch twizll accountId against store name
  //check if buyer has 100 loyality points or more every 100 points = 2 pounds
  //ask buyer if they would like to use loyalty points
  //yes. deduct amount from amount payable
  //send buyer to stripe for payment
  //if payment is successful
  //distribute payments to sellers after deducting 20% service charge
  //send payment for seller without accountid to twizll accountid
  //update wallet of store without stripe accountId with amount earned
  //create order
  //go to dhl and generate waybill for the individual items using their dimensions
  //create transaction
  //email seller new order with order id, order items and waybill for individual items
  //email buyer orderid, order items and tracking id from waybill
  //update buyer profile with bought items
  //increment numberSold of each product
  //deduct qty sold from availableQty of each product
  //calculate loyality point for buyer(every 20 pounds gets one point)and update buyer points (amount for calculating loyallity points should be in an env sincesubject to change)

  //NOTE:
  //create ability for sellers to withdraw money from their stripe account. the withdrawal should be atomatic for sellers with stripe account and manual for sellers without stripe account where admin will process withdrawal.

  const { shippingAddress, cartTotal, cartItems } = req.body

  // const buyer = req.user

  // if (!buyer) {
  //   return next(
  //     new Error('You need to be logged in to perform this action', 403)
  //   )
  // }

  let products = []

  for (let i = 0; i < cartItems.length; i++) {
    const prod = await Product.findById(cartItems[i].product)
    let newCartItems = {}
    if (cartItems[i].qty < prod.availableQty) {
      newCartItems.product = cartItems[i].product
      newCartItems.qty = cartItems[i].qty
      newCartItems.total = cartItems[i].qty * prod.unitPrice
      newCartItems.store = prod.store
    }
    products.push(newCartItems)
  }

  //group products according to store
  const result = _(products)
    .groupBy(x => x.store)
    .map((value, key) => ({ store: key, products: value }))
    .value()

  //calculate store total
  let gTotal = []
  for (let x = 0; x < result.length; x++) {
    for (let j = 0; j < result[x].products.length; j++) {
      if (result[x].store.id == result[x].products[j].store.id) {
        console.log(result[x].products[j].total)
      }
    }
  }

  res.status(200).json({
    status: 'success',
    message: 'success',
    data: result,
  })
}
module.exports = checkOut

//1. Create a PaymentIntent - server side ( create payment intent, get client secrete and sent to the frontend)
    // get payload, inspect payload, attach requisite info to the stripe object and send to stripe to create payment intent. get client screte and send to the frontend.
//2. Collect a payment method - frontend (make call to collect payment end point for buyer to pay, get updated payment intent and hold)
//3. Process the payment - front end (make a call to process payment with the update payment intent, get result.paymentIntent.id and send to server)
//4. Capture the payment - server side (make a call to capture payment using the payment intent id returned from step 3. this completes the process)
    //create order
    // create transaction
    // group order items according to store
    // claculate 20% service charge
    // update store wallet with amount earned 
    // make a call to DHL and get the label for each item (note would be better if we could group the items and create one label)
    // send mail to seller with items sold,amount earned and label for items, 
    // send mail to buyer with items bought, and tracking id returned from dhl