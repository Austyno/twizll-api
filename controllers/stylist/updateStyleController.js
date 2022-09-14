const Style = require('../../models/styleModel')

const updateStyle = async (req, res, next) => {
  const { styleId } = req.params
  const stylist = req.user
  const { name, collectionId, description, style_items, price } = req.body

  const stylUpd = await Style.findById(styleId)

  if (!collectionId) {
    return res.status(400).json({
      status: 'failed',
      message: 'Collection id is required to update this style',
      data: '',
    })
  }
  if (!stylUpd) {
    return res.status(404).json({
      status: 'failed',
      message: 'we could not find the style in our records',
      data: '',
    })
  }

  if (stylUpd.stylist.toString() != stylist.id.toString()) {
    return res.status(403).json({
      status: 'failed',
      message: 'You can only edit styles that belong to you',
      data: '',
    })
  }

  try {
    const data = {}
    if (name) {
      data.name = name
    }

    if (description) {
      data.description = description
    }
    if (price) {
      data.price = price
    }
    if (collectionId) {
      data.collectionId = collectionId
    }

    const upd = await Style.findOneAndUpdate(
      { _id: styleId },
      { $set: data },
      { new: true }
    )

    if (style_items && Array.isArray(style_items)) {
      for (let item of style_items) {
        upd.style_items.push(item)
      }
      upd.save({ validateBeforeSave: false })
    }
    return res.status(200).json({
      status: 'success',
      message: 'style updated successfully',
      data: upd,
    })
  } catch (e) {
    return next(e)
  }
}
module.exports = updateStyle
//
