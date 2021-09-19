const router = require('express').Router()
const viewProduct = require('../../controllers/buyer/viewProductController')
const setSession = require('../../middleware/setSession')


router.route('/products/:productId').get(viewProduct)

module.exports = router
