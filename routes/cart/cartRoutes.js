const router = require('express').Router()
const setSession = require('../../middleware/setSession')
const checkCart = require('../../middleware/checkCart')
const addToCart = require('../../controllers/cart/addToCartController')
const updateCart = require('../../controllers/cart/updateCartController')
const getCart = require('../../controllers/cart/getCartController')
const clearCart = require('../../controllers/cart/clearCartController')
const add_multiple = require('../../controllers/cart/addMultipleProductsToCart')
const addLoggedInUserToCart = require('../../middleware/addUserCart')

router.use(setSession, addLoggedInUserToCart, checkCart)

router.route('/').post(addToCart).get(getCart)
router.route('/clear').get(clearCart)
router.route('/:productId').get(updateCart)
router.route('/add-multiple').post(add_multiple)

module.exports = router
