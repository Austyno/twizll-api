const router = require('express').Router()

const getAllProducts = require('../controllers/seller/getAllproductsController')
const authRole = require('../middleware/authRole')
const authenticated = require('../middleware/authenticated')


router
  .route('/')
  .get(authenticated, authRole(['seller', 'admin']), getAllProducts)

module.exports = router