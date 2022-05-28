const Seller = require('../../models/sellerModel')
const Store = require('../../models/storeModel')
const path = require('path')
const Error = require('../../utils/errorResponse')
const cloudStorage = require('../../utils/uploadToCloudinary')

const storeLogo = (req, res, next) => {
  const seller = req.user
  const sellerStore = req.store
  const image = req.files.logo

  if (!seller) {
    return next(new Error('You need to sign in to view this page', 401))
  }
  if (!sellerStore) {
    return next(new Error('Only store owners can perform this action', 403))
  }

  const allowedMediaTypes = ['jpg', 'jpeg', 'png']

  if (!allowedMediaTypes.includes(image.mimetype.split('/')[1])) {
    return next(
      new Error(
        `Media type ${
          image.mimetype.split('/')[1]
        } is not allowed. Allowed image types ${allowedMediaTypes}`,
        400
      )
    )
  }

  if (image.size > 1000000) {
    return next(
      new Error(
        `Upload file size is too large. Upload a file less or equal to 1mb`,
        400
      )
    )
  }
  try {
    const newName = `${image.name.split('.')[0]}-${
      sellerStore.id
    }${path.extname(image.name)}`

    cloudStorage(image.tempFilePath).then(async result => {
      const update = await Store.findOneAndUpdate(
        sellerStore.id,
        {
          logo: result.secure_url,
        },
        { new: true }
      )

      res.status(200).json({
        status: 'success',
        message: 'Store logo updated successfully',
        data: update,
      })
    })
  } catch (e) {
    return next(new Error(e.message, 500))
  }
}
module.exports = storeLogo
