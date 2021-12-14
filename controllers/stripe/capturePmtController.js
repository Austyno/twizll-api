const Error = require('../../utils/errorResponse')
const Buyer = require('../../models/buyerModel')
const Seller = require('../../models/sellerModel')
const Product = require('../../models/productModel')
const Store = require('../../models/storeModel')
const _ = require('lodash')
const stripeUtil = require('../../utils/stripe/Stripe')


const capturePmt = async (req,res,next) => {
  const { cartTotal, shippingAddress, cartItems,intentId } = req.body
  
  //get payload wit intent id
  try{
    // call stripe with intent id
    const capture = await stripeUtil.capturePayment(intentId)

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

  }catch(e){
    return next(new Error(e.message,500))
  }
  // pmt returns successful
  // send success message to frontend
  // group items according to store
  // calculate total sold per store and deduct 20%
  // update store wallet with amount earned after deduction
  // create order
  // create transaction
  // get product info and send to dhl to get label with tracking id
  // mail buyer with order details including tracking ids
  // mail seller with order details and labels
}
module.exports = capturePmt
// create a dummy database for testing and a production database