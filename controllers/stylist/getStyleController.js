const Style = require('../../models/styleModel')

const getStyle = async (req, res, next) => {
  const { style_id } = req.params
  try {
    const style = await Style.findById(style_id).populate('style_items')
    if(!style){
      return res.status(404).json({
        status:"not found",
        message:'the style does not exist',
        data:''
      })
    }

    return res.status(200).json({
      status:"success",
      message:"style retrieved successfullty",
      data:style
    })

  } catch (e) {
    return next(e)
  }
}
module.exports = getStyle
//const limit = req.query.limit || 10;
// const skipValue = req.query.skip || 0;
// const posts = await Style.find().limit(limitValue).skip(skipValue);
// const meta = {
        // pages: Math.ceil(count / limit),
        // total: count,
      // };
