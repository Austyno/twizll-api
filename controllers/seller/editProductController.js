const Store = require('../../models/storeModel')
const Product = require('../../models/productModel')
const Error = require('../../utils/errorResponse')


const editProduct = async (req,res,next) => {
  const {productId} = req.params
  const seller = req.user
  const sellerStore = req.store
  if(!seller){
    return next(new Error('Please sign in first',403))
  }
  if (sellerStore === null) {
    return next(new Error('Only store owners can perform this action', 403))
  }

  try{
    const editProduct = await Product.findById(productId).populate('category','name')
    res.status(200).json({
      status:'success',
      message:"Here is the product to edit",
      data:editProduct
    })
  }catch(e){
    return next(new Error(e.message,500))
  }
  
}
module.exports = editProduct