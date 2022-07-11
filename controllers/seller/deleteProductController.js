const Store = require('../../models/storeModel')
const Product = require('../../models/productModel')
const Error = require('../../utils/errorResponse')
const deleteFromCloudinary = require('../../utils/deleteFromCloudinary')

const deleteProduct = async (req, res, next) => {
  const seller = req.user
  const sellerStore = req.store
  const { productId } = req.params

  if (!seller) {
    return next(new Error('You need to sign in to perform this action', 403))
  }

  if (!sellerStore) {
    return next(new Error('Only store owners can perform this action', 403))
  }
  try {
    const prod = await Product.findById(productId)

    if (!prod) {
      return next(new Error('this product does not exist', 400))
    }

    if (prod.store.toString() === sellerStore.id.toString()) {
      deleteFromCloudinary(prod.mainPhoto)
      if (prod.photos !== null) {
        prod.photos.forEach(photo => {
          deleteFromCloudinary(photo)
        })
      }

      await Product.findByIdAndDelete(productId)
      return res.status(200).json({
        status: 'success',
        message: 'product deleted successfully',
        data: '',
      })
    } else {
      return next(new Error('You cannot delete this product', 403))
    }
  } catch (e) {
    return next(new Error(e.message, 500))
  }
}
module.exports = deleteProduct
