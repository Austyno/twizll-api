const Category = require('../../models/productCategoryModel')


const getAllCategory = async(req,res,next) => {
  const seller = req.user
  const sellerStore = req.store 

  if (!seller) {
    return next(new Error('You need to sign in', 401))
  }

  if (!sellerStore) {
    return next(new Error('Only store owners can perform this action', 403))
  }

  try{
    const cat = await Category.find()
    res.status(200).json({
      status:'success',
      message:'All product categories',
      data:cat
    })
  }catch(e){
    return next(new Error(e.message,500))
  }

}
module.exports = getAllCategory