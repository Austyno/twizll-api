const Error = require('../../utils/errorResponse')
const Product = require('../../models/productModel')
const Category = require('../../models/categoryModel')

const getAllProducts = async (req, res, next) => {

  try {
    res.status(200).json(req.search)
  } catch (e) {
    return next(new Error(e.message, 500))
  }
}
module.exports = getAllProducts
