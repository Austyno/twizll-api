const Collection = require('../../models/collectionModel')
const cloudStorage = require('../../utils/uploadToCloudinary')

const createCollection = async (req, res, next) => {
  const { name, image, description } = req.body
  // const image = req.files.image
  
    const errors = {}
    try {
      if (!name) {
        errors.name = 'please add a name for this collection'
      }
      if (!description) {
        errors.description = 'please add a description to this collection'
      }
      if (!req.files) {
        errors.image = 'the collection requires an image'
      }

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({
          status: 'failed',
          message: 'please fix all the errors',
          data: errors,
        })
      }

      const resp = await cloudStorage(req.files.image.tempFilePath)

      const collection = await Collection.create({
        name,
        photo: resp.secure_url,
        briefDesc: description,
      })

      return res.status(201).json({
        status: 'success',
        message: 'collection created successfully',
        data: collection,
      })
    } catch (e) {
      return next(e)
    }
}
module.exports = createCollection
