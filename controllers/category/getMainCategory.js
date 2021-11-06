const MainCat = require('../../models/mainCategoryModel')
const Error = require('../../utils/errorResponse')


const getMainCat = async (req,res,next)=> {
  try{
    const cats = await MainCat.find()
    res.status(200).json({
      status:"success",
      message:"Main category retrieved successfully",
      data:cats
    })
  }catch(e){
    return next(new Error(e.message,500))
  }
}
module.exports = getMainCat
