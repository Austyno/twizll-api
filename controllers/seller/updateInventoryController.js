const Product = require('../models/productModel')
const Error = require('../../utils/errorResponse')

const updateInventory = async (req,res,next) => {
  const {productId} = req.params
  const {qty} = req.body
  const seller = req.user
  const sellerStore = req.store
  if (!seller) {
    return next(new Error('You need to sign in to view this page', 401))
  }
  if (!sellerStore) {
    return next(new Error('Only store owners can perform this action', 403))
  }

  const inventoryToUpdate = await Product.find({
    $and: [{ store: sellerStore.id }, {_id:productId  }],
  })
  

  if(!inventoryToUpdate){
    return next(Error('this product does not exist ',404))
  }

  try{
    inventoryToUpdate.availableUnits = qty

    inventoryToUpdate.save({validateBeforeSave: false})

    res.status(200).json({
      status: 'success',
      message: 'product inventory updated successfully',
      data: inventoryToUpdate,
    })
  }catch(e){
    return next(new Error(e.message, 500))
  }

}

module.exports = updateInventory