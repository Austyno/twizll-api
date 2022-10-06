const Style = require('../../models/styleModel')

const getStyle = async (req, res, next) => {
  const { style_id } = req.params
  try {
    const style = await Style.findById(style_id).populate('style_items')
    if (!style) {
      return res.status(404).json({
        status: 'not found',
        message: 'we could not find the style in our records',
        data: '',
      })
    }

    style.views = Number(style.views) + 1
    style.save()
    return res.status(200).json({
      status: 'success',
      message: 'style retrieved successfullty',
      data: style,
    })
  } catch (e) {
    return next(e)
  }
}
module.exports = getStyle
