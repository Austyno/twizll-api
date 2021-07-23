const Store = require('../../models/storeModel')
const Product = require('../../models/productModel')
const Error = require('../../utils/errorResponse')
const cloudStorage = require('../../utils/uploadToCloudinary')

require('../../models/productModel')
require('../../models/productCategoryModel')

const addProduct = async (req, res, next) => {
  const seller = req.user
  if (req.store === null) {
    return next(
      new Error('You need to create a store first then add products', 400)
    )
  }
  const sellerStore = req.store

  const {
    category,
    name,
    description,
    returnPolicy,
    brand,
    sourceOfMaterial,
    attributes,
    totalNoOfUnits,
    weight,
    unitPrice,
    mainPhoto,
    discount,
    photos,
  } = req.body

  console.log(req.body)

const uploadedPhotos = []

  photos.forEach(photo => {
    cloudStorage(photo)
      .then(result => uploadedPhotos.push(result.secure_url))
      .catch(e => console.log(e))
  })

    cloudStorage(mainPhoto)
      .then(async result => {
        const product = await Product.create({
          category,
          name,
          description,
          returnPolicy,
          brand,
          sourceOfMaterial,
          attributes,
          totalNoOfUnits,
          weight,
          unitPrice,
          mainPhoto: result.secure_url,
          photos: uploadedPhotos,
          discount,
          store: sellerStore.id,
        })
        res.status(201).json({
          status: 'success',
          message: 'product created successfully',
          data: product,
        })
      })
      .catch(e => next(new Error(e.message,500)))
  }

module.exports = addProduct
