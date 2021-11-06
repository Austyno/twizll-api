const Product = require('../../models/productModel')
const Error = require('../../utils/errorResponse')

const getSubCatProducts = async(req,res,next) => {
  const {subCatId} = req.params
  try{
    const products = await Product.find({sub_category: subCatId})
    res.status(200).json({
      status:'success',
      message:'sub category products retrieved successfully',
      data: products
    })
  }catch(e){
    return next(new Error(e.message))
  }
}
module.exports = getSubCatProducts
