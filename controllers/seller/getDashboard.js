const Product = require('../../models/productModel')
const Error = require('../../utils/errorResponse')
const Store = require('../../models/storeModel')



const dashboardProducts = async(req,res,next) => {
  const seller = req.user
  const sellerStore = req.store

  if(!seller){
    return next(new Error('You need to sign in to view this page',401))
  }
  if (!sellerStore) {
    return next(new Error('Only store owners can perform this action', 403))
  }

  try{
    const products = await Product.find({ store: sellerStore._id })

    const bestSellers = products.sort((a, b) => b.numberSold - a.numberSold).slice(0,10)
      
    const mostViewed = products.sort((a, b) => b.views - a.views).slice(0, 10)


      res.status(200).json({
        status: 'success',
        message: 'Best selling and most viewed products retrieved successfully',
        data: { bestSellers, mostViewed },
      })

  }catch(e){
    return next(new Error(e.message,500))
  }
}
module.exports = dashboardProducts