const fs = require('fs')
const path = require('path')
const Store = require('../../models/storeModel')
const Product = require('../../models/productModel')
const Error = require('../../utils/errorResponse')
const cloudStorage = require('../../utils/uploadToCloudinary')
const convert = require('../../utils/convertCurrentcy')


require('../../models/productModel')
require('../../models/categoryModel')

//TODO: refactor using transactions to prevent photos from being uploaded if there is an error

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
    discount,
    currency
  } = req.body

  const photos = req.files.photos

  const converted = await convert(currency, 'GBP', unitPrice)

  if (Array.isArray(photos))
    if (photos.length < 1) {
      return next(new Error('please upload at least one image in photos', 400))
    }
  const uploadedPhotos = []

  photos.forEach(photo => {
    cloudStorage(photo.tempFilePath)
      .then(result => {
        uploadedPhotos.push(result.secure_url)

        const tmpFilePath = path.join(__dirname, '../../tmp/')
        fs.unlink(`${tmpFilePath + result.original_filename}`, (err, reslt) => {
          if (!err) {
            console.log('file deleted')
          }
        })
      })
      .catch(e => console.log(e))
  })

  cloudStorage(req.files.mainPhoto.tempFilePath)
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
        unitPrice: converted + 20,
        mainPhoto: result.secure_url,
        photos: uploadedPhotos,
        discount,
        store: sellerStore.id,
      })
      const tmpFilePath = path.join(__dirname, '../../tmp/')
      fs.unlink(`${tmpFilePath + result.original_filename}`, (err, reslt) => {
        if (!err) {
          console.log('file deleted')
        }
      })
      res.status(201).json({
        status: 'success',
        message: 'product created successfully',
        data: product,
      })
    })
    .catch(e => next(new Error(e.message, 500)))
}

module.exports = addProduct
