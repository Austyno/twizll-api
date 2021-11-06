const Cat = require('../../models/categoryModel')
const Error = require('../../utils/errorResponse')

const getCategory = async (req, res, next) => {
  const { mainCatId } = req.params
  try {
    const cats = await Cat.find({ mainCategory: mainCatId })

    res.status(200).json({
      status: 'success',
      message: 'Categories retrieved successfully',
      data: cats,
    })
  } catch (e) {
    return next(new Error(e.message, 500))
  }
}
module.exports = getCategory
