const SubCat = require('../../models/subcategoryModel.js')
const Error = require('../../utils/errorResponse')

const subCategories = async (req, res, next) => {
  const { catId } = req.params
  try {
    const subcats = await SubCat.find({ parentCategory: catId })

    res.status(200).json({
      status: 'success',
      message: 'subcategories retrieved successfully',
      data: subcats,
    })
  } catch (e) {
    return next(new Error(e.message))
  }
}
module.exports = subCategories
