const Error = require('../../utils/errorResponse')
const Product = require('../../models/productModel')
const shuffle = require('../../utils/shuffle')


const recommendedProducts = async (req,res,next) => {
  try{
    const products = await Product.find({})
    const recommended = shuffle(products).slice(0, 10)
    res.status(200).json({
      status: 'success',
      message: 'recommended products retrieved successfully',
      data: recommended,
    })
  }catch(e){
    return next(new Error(e.message,500))
  }
}
module.exports = recommendedProducts