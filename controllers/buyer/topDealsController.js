const Error = require('../../utils/errorResponse')
const Deal = require('../../models/dealsModel')

const topDeals = async (req, res, next) => {
  try {
    const topDeals = await Deal.find({}).populate('products')
    res.status(200).json({
      status: 'success',
      message: 'top deals retrieved successfully',
      data: topDeals
    })
  } catch (e) {
    return next(new Error(e.message, 500))
  }
}
module.exports = topDeals
