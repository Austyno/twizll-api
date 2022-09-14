const Style = require('../../models/styleModel')

const editStyle = async (req, res, next) => {
  const { styleId } = req.params
  const stylist = req.user

  if (!stylist) {
    return res.status(403).json({
      status: 'failed',
      message: 'You need to login to perform this action',
      data: '',
    })
  }

  try {
    const style = await Style.findById(styleId)

    if (!style) {
      return res.status(404).json({
        status: 'failed',
        message: 'we could not find the style in our records',
        data: '',
      })
    }
    if (style.stylist.toString() != stylist.id.toString()) {
      return res.status(403).json({
        status: 'failed',
        message: 'You can only edit your styles',
        data: '',
      })
    }
    return res.status(200).json({
      status: 'success',
      message: 'style retrieved successfully',
      data: style,
    })
  } catch (e) {
    return next(e)
  }
}
module.exports = editStyle
