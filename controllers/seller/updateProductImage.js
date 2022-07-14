const Seller = require('../../models/sellerModel')
const Error = require('../../utils/errorResponse')
const path = require('path')
const Product = require('../../models/productModel')
const cloudStorage = require('../../utils/uploadToCloudinary')

const updateProductImage = async (req, res, next) => {
  const { productId } = req.params
  const seller = req.user
  const sellerStore = req.store

  if (!seller) {
    return next(new Error('You need to sign in to view this page', 401))
  }
  if (!sellerStore) {
    return next(new Error('Only store owners can perform this action', 403))
  }

  try {
    const product_found = await Product.findById(productId)

    if (product_found == null) {
      return res.status(404).json({
        status: 'failed',
        message: 'this product does not exist',
        data: '',
      })
    }

    if (sellerStore.id.toString() !== product_found.store.toString()) {
      return res.status(401).json({
        status: 'error',
        message: 'You can only update products that belong to your store',
        data: '',
      })
    }

    if (!req.files) {
      return res.status(400).json({
        status: 'error',
        message: 'please add and image file',
      })
    }
    const allowedMediaTypes = ['jpg', 'jpeg', 'png']

    if (req.files && req.files.photos && Array.isArray(req.files.photos)) {
      if (
        !allowedMediaTypes.includes(req.files.photos[0].mimetype.split('/')[1])
      ) {
        return next(
          new Error(
            `Media type ${
              req.files.photos[0].mimetype.split('/')[1]
            } is not allowed. Allowed image types ${allowedMediaTypes}`,
            400
          )
        )
      }

      if (req.files.photos[0].size > 1000000) {
        return next(
          new Error(
            `Upload file size is too large. Upload a file less or equal to 1mb`,
            400
          )
        )
      }
      req.files.photos.forEach(async photo => {
        const result = await cloudStorage(photo.tempFilePath)
        const updated = await Product.findOneAndUpdate(
          { _id: productId },
          { $push: { photos: result.secure_url } },
          { new: true }
        )
      })
      // return res.status(200).json({
      //   status: 'success ',
      //   message: 'images updated successfully',
      //   data: updated,
      // })
    }

    if (req.files && req.files.photos) {
      if (
        !allowedMediaTypes.includes(req.files.photos.mimetype.split('/')[1])
      ) {
        return next(
          new Error(
            `Media type ${
              req.files.photos.mimetype.split('/')[1]
            } is not allowed. Allowed image types ${allowedMediaTypes}`,
            400
          )
        )
      }

      // if (req.files.photos.size > 1000000) {
      //   return next(
      //     new Error(
      //       `Upload file size is too large. Upload a file less or equal to 1mb`,
      //       400
      //     )
      //   )
      // }
      const result = await cloudStorage(req.files.photos.tempFilePath)

      const updated = await Product.findOneAndUpdate(
        { _id: productId },
        { $push: { photos: result.secure_url } },
        { new: true }
      )

      // return res.status(200).json({
      // status:"success ",
      // message:'image updated successfully',
      // data: updated
      // })
    }

    if (req.files && req.files.mainPhoto) {
      if (
        !allowedMediaTypes.includes(req.files.mainPhoto.mimetype.split('/')[1])
      ) {
        return next(
          new Error(
            `Media type ${
              req.files.mainPhoto.mimetype.split('/')[1]
            } is not allowed. Allowed image types ${allowedMediaTypes}`,
            400
          )
        )
      }

      // if (req.files.mainPhoto.size > 1000000) {
      //   return next(
      //     new Error(
      //       `Upload file size is too large. Upload a file less or equal to 1mb`,
      //       400
      //     )
      //   )
      // }
      const result = await cloudStorage(req.files.mainPhoto.tempFilePath)
      await Product.findOneAndUpdate(
        { _id: productId },
        { $set: { mainPhoto: result.secure_url } },
        { new: true }
      )
    }

    res.status(200).json({
      status: 'success',
      message: 'product image updated successfully',
      data: await Product.findById(productId),
    })
  } catch (e) {
    return next(e)
  }
}
module.exports = updateProductImage
