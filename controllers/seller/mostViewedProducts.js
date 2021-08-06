const Product = require('../../models/productModel')
const Error = require('../../utils/errorResponse')

const mostViewed = async (req, res, next) => {
  const { categoryId } = req.params
  const seller = req.user,
    sellerStore = req.store

  if (!seller) {
    return next(new Error('You need to sign in to view this page', 401))
  }
  if (!sellerStore) {
    return next(new Error('Only store owners can perform this action', 403))
  }

  // if (categoryId){
  //   try{

  //   }catch(e){
  //     return next(e.message,500)
  //   }
  // }
  try {
    const mostViewedProducts = await Product.find({ store: sellerStore._id })
      .sort({
        views: -1,
      })
      .limit(10)
      .populate({ path: 'category', select: 'name briefDesc mainPhoto' })

    res.status(200).json({
      status: 'success',
      message: 'Top 10 most viewed products retrieved successfully',
      data: mostViewedProducts,
    })
  } catch (e) {
    return next(new Error(e.message, 500))
  }
}

module.exports = mostViewed
