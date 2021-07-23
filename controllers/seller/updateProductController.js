const Store = require('../../models/storeModel')
const Product = require('../../models/productModel')
const Error = require('../../utils/errorResponse')
const cloudStorage = require('../../utils/uploadToCloudinary')

//TODO:refactor to only upload images if they were changed and not the same with what was there b4
const updateProduct = async (req, res, next) => {
  const { productId } = req.params
  const {
    name,
    unitPrice,
    photos,
    weight,
    brand,
    description,
    mainPhoto,
    totalNoOfUnits,
    attributes,
    returnPolicy,
    sourceOfMaterial,
  } = req.body
  const seller = req.user
  const sellerStore = req.store
  if (!seller) {
    return next(new Error('Please sign in first', 403))
  }
  if (sellerStore === null) {
    return next(
      new Error('You need to create a store first then add products', 401)
    )
  }

  const proToUpdate = await Product.findById(productId)
  let updatedPhotos  = []

  photos.forEach(photo => {
    cloudStorage(photo).then(result => updatedPhotos.push(result.secure_url))
  })

  cloudStorage(mainPhoto).then(async result => {
    const updateProduct = await Product.findByIdAndUpdate(productId, {
      name,
      unitPrice,
      photos:updatedPhotos,
      weight,
      brand,
      description,
      mainPhoto:result.secure_url,
      totalNoOfUnits,
      attributes,
      returnPolicy,
      sourceOfMaterial,
    },{new:true})
    res.status(201).json({
      status: 'success',
      message: 'product updated successfully',
      data: updateProduct,
    })
  }).catch(e => next(new Error(e.message,500))) 

}
module.exports = updateProduct
