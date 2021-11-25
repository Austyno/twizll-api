const Buyer = require('../../models/buyerModel')
const Error = require('../../utils/errorResponse')
const path = require('path')
const cloudStorage = require('../../utils/uploadToCloudinary')

const updateProfileImage = async (req, res, next) => {
  const buyer = req.user
  const image = req.files.profileImage

  if (!buyer) {
    return next(new Error('You need to sign in to perform this operation', 401))
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
    const newName = `${image.name.split('.')[0]}-${buyer.id}${path.extname(
      image.name
    )}`

    cloudStorage(image.tempFilePath).then(async result => {
      const update = await Buyer.findOneAndUpdate(
        { _id: buyer.id },
        { $set: { photo: result.secure_url } },
        {new:true}
      )
      update.token = undefined
      res.status(200).json({
        status: 'success',
        message: 'profile image updatesd successfully',
        data: update,
      })
    })
  } catch (e) {
    return next(new Error(e.message, 500))
  }
}
module.exports = updateProfileImage
