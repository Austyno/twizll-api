const Error = require('../../utils/errorResponse')
const Favourite = require('../../models/favouritesModel')
const Product = require('../../models/productModel')

const getFavorites = async (req, res, next) => {
  const buyer = req.user
  if (!buyer) {
    return next(new Error('please log in to continue', 403))
  }
  try {
    const fav = await Favourite.findOne({ owner: buyer.id }).populate('favourites')
    res.status(200).json({
      status:'success',
      message:'favourites retrived successfully',
      data: fav
    })
  } catch (e) {
    return next(new Error(e.message, 500))
  }
}
module.exports = getFavorites
