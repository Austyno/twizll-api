const Seller = require('../../models/sellerModel')
const Error = require('../../utils/errorResponse')
const path = require('path')
const cloudStorage = require('../../utils/uploadToCloudinary')

const updateProfileImage = async (req, res, next) => {
  const seller = req.user
  const sellerStore = req.store
  const image = req.files.profileImage

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
    const newName = `${image.name.split('.')[0]}-${seller.id}${path.extname(
      image.name
    )}`
    const result = await cloudStorage(image.tempFilePath)

    const data = {
      photo: result.secure_url,
    }

    const update = await Seller.findOneAndUpdate(
      { _id: seller.id },
      { $set: data },
      { new: true }
    )

    update.token = undefined
    update.refreshToken = undefined

    res.status(200).json({
      status: 'success',
      message: 'profile image updatesd successfully',
      data: update,
    })
  } catch (e) {
    return next(new Error(e.message, 500))
  }
}
module.exports = updateProfileImage
