const router = require('express').Router()
const setSession = require('../../middleware/setSession')
const addToCart = require('../../controllers/cart/addToCartController')

router.use(setSession)

router.route('/add').post(addToCart)
module.exports = router
