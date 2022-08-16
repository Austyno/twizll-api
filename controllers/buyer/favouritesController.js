const Error = require('../../utils/errorResponse')
const Favourite = require('../../models/favouritesModel')
const Product = require('../../models/productModel')

const favourite = async (req, res, next) => {
  const buyer = req.user
  const { product } = req.body

  if (!buyer) {
    return next(new Error('Please login to favourite', 403))
  }
  if (!product) {
    return next(new Error('please add a product id', 400))
  }
  const exist = await Product.findById(product)
  if (!exist) {
    return next(new Error('product does not exist', 404))
  }
  try {
    const buyerFav = await Favourite.findOne({ owner: buyer.id })

    if (buyerFav === null){
      const fav = await Favourite.create({
        owner: buyer.id,
        favourites: [product],
      })
      return res.status(201).json({
        status: 'success',
        message: 'product added successfully to favourites',
        data: fav,
      })
    }
      if (buyerFav.favourites.includes(product.toString())) {
        console.log('removing...')

        const newFav = buyerFav.favourites.filter(
          item => item != product.toString()
        )
        buyerFav.favourites = newFav
        buyerFav.save()

        return res.status(200).json({
          status: 'success',
          message: 'product removed from favourites successfully',
          data: buyerFav,
        })
      } else {
        console.log('adding...')
        buyerFav.favourites.push(product)
        buyerFav.save()
        return res.status(200).json({
          status: 'success',
          message: 'product added successfully to favourites',
          data: buyerFav,
        })
      }
  } catch (e) {
    return next(new Error(e.message, 500))
  }
}
module.exports = favourite
