const Error = require('../../utils/errorResponse')
const Product = require('../../models/productModel')
const Category = require('../../models/categoryModel')
const Collection = require('../../models/collectionModel')
const Deal = require('../../models/dealsModel')
const shuffle = require('../../utils/shuffle')

const shopPage = async (req, res, next) => {
  //get collections
  try {
    const collections = await Collection.find().populate(
      'products',
      'name unitPrice briefDesc mainPhoto'
    )

    const topDeals = await Deal.find({}).populate('products')

    const products = await Product.find({})
    const recommended = shuffle(products).slice(0, 10)

    const categories = await Category.find({})
    const mostViewedCategory = categories
      .sort((a, b) => b.views - a.views)
      .slice(0, 10)

    res.status(200).json({
      status: 'success',
      message: 'Items retrieved successfully',
      data: {
        collections,
        topDeals,
        recommended,
        mostViewedCategory,
      },
    })
  } catch (e) {
    return next(new Error(e.message, 500))
  }
}
module.exports = shopPage
