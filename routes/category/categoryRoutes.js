const router = require('express').Router()

const mainCat = require('../../controllers/category/getMainCategory')
const subcats = require('../../controllers/category/getSubCategories')
const getCategory = require('../../controllers/category/getCategory')
const getSubCatProducts = require( '../../controllers/category/getSubCatProducts' )


router.route('/').get(mainCat)
router.route('/category/:mainCatId').get(getCategory)
router.route('/subcategories/:catId').get(subcats)
router.route('/sub-category/products/:subCatId').get(getSubCatProducts)

module.exports = router
