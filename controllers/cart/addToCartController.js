/**
 * 1. get product id and qty from req.body
 * 2. make sure qty and prduct are passed or return an error
 * 3. locate product from products using product id passed
 * 4. get cart for this user using session id for not logged in user and user id for logged in user
 * 5. check if the product in the cart is <= 0, remove if true
 * 6. if product is found in the cart and qty is > 0, update the product with new qty
 * 7. compute cartItems total price ( qty * unit price of product)
 * 8. if cart has promo code, compute discounted price and subtract from total price
 * 9. compute cart total price by reducing cartItems total price
 * 10. compute cart discounted price by reducing cartitems discounted price
 * 11. if product is not found in current cart and qty > 0, push new item into cartItems
 */
const Cart = require('../../models/cartModel')
const Error = require('../../utils/errorResponse')
const addToCart = () => {
  const {productId,qty} = req.body


}
module.exports = addToCart