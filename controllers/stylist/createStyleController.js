const Style = require('../../models/styleModel')
const cloudStorage = require('../../utils/uploadToCloudinary')

const createStyle = async (req, res, next) => {
  const stylist = req.user
  const { name, collection, description, style_items, price } = req.body
  const image = req.files.image
  try {
    let errors = {}
    if (!name) {
      errors.name = 'Please provide a nme for this style'
    }
    if (!collection) {
      errors.collection = 'This style needs to belong to a collection'
    }
    if (!description) {
      errors.description = 'Please describe this style'
    }
    if (Array.isArray(style_items) && style_items.length == 0) {
      errors.style_items = 'please add at least a single item to this style'
    }
    if (!price) {
      errors.price = 'Tell us ho much this style cost'
    }
    if (!req.files.image) {
      errors.image = 'Please provide an image for this style'
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        status: 'Bad request',
        message: 'Please Fix the error/s to continue',
        data: errors,
      })
    }

    const result = await cloudStorage(image.tempFilePath)

    const style = await Style.create({
      name,
      description,
      style_items,
      price,
      stylist: stylist.id,
      collectionId: collection,
      image: result.secure_url,
    })

    return res.status(201).json({
      status: 'success',
      message: 'Style created successfully',
      data: style,
    })
  } catch (e) {
    return next(e)
  }
}
module.exports = createStyle
