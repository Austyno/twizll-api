const Error = require('../../utils/errorResponse')
const Category = require('../../models/categoryModel')


const mostViewedCategory = async (req,res,next) =>{

  try{
    const categories = await Category.find({})
    const mostViewedCategory = categories
      .sort((a, b) => b.views - a.views)
      .slice(0, 10)
      res.status(200).json({
        status: 'success',
        message: 'most viewed categories retrieved successfully',
        data: mostViewedCategory,
      })
  }catch(e){
    return next(new Error(e.message,500))
  }
}

module.exports = mostViewedCategory
