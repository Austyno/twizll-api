const Store = require('../../models/storeModel')
const Product = require('../../models/productModel')
SubCategory = require('../../models/subcategoryModel')
const Error = require('../../utils/errorResponse')
require('../../models/productModel')
require('../../models/categoryModel')

//get the logged in seller products only
const getAllProductsByCat = async (req, res, next) => {
  const { catId } = req.params
  const seller = req.user
  const sellerStore = req.store

  if (!seller) {
    return next(new Error('You need to sign in', 401))
  }

  if (!sellerStore) {
    return next(
      new Error(
        'Only store owners can perform this action. Please create a store and add products',
        403
      )
    )
  }


  try {
    //get all sub category with catId as parent id
    const subcat = await SubCategory.find({ parentCategory: catId })

    //find all products that belong to each sub category
    if (subcat.length > 0) {
      let products = []

      for (let i = 0; i < subcat.length; i++) {
        const product = await Product.find({
          $and:[{sub_category:subcat[i].id},{store:sellerStore.id}]
        })
        products.push(product)
      }
      
      //flatten the products array
      const pro = [].concat.apply([], products)

      res.status(200).json({
        status: 'success',
        message: 'products retrieved',
        data: pro,
      })
    }
  } catch (e) {
    return next(new Error(e.message, 500))
  }
}
module.exports = getAllProductsByCat
// h111
