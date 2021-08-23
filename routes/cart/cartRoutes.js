const router = require('express').Router()
const setSession = require('../../middleware/setSession')
const checkCart = require('../../middleware/checkCart')
const addToCart = require('../../controllers/cart/addToCartController')
const updateCart = require('../../controllers/cart/updateCartController')
const getCart = require('../../controllers/cart/getCartController')
const clearCart = require('../../controllers/cart/clearCartController')

router.use(setSession, checkCart)

router.route('/').post(addToCart).get(getCart)
router.route('/clear').get(clearCart)
router.route('/:productId').get(updateCart)

module.exports = router
