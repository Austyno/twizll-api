const fs = require('fs')
const path = require('path')
const Store = require('../../models/storeModel')
const Product = require('../../models/productModel')
const Error = require('../../utils/errorResponse')
const cloudStorage = require('../../utils/uploadToCloudinary')
const convert = require('../../utils/convertCurrentcy')
const stripeUtil = require('../../utils/stripe/Stripe')

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
    subcategory,
    name,
    description,
    returnPolicy,
    brand,
    sourceOfMaterial,
    attributes,
    availableQty,
    unitPrice,
    discount,
    currency,
    height,
    width,
    weight,
    length,
  } = req.body

  const photos = req.files?.photos

  //parse attributes
  const parsed = JSON.parse(attributes)

  if (req.files.photos == null) {
    return res.status(400).json({
      status: 'error',
      message: 'Please upload an image',
      data: '',
    })
  }
  if (req.files.photos && Array.isArray(req.files.photos))
    if (photos.length < 1) {
      //check if more than one photo is uploaded
      return next(new Error('please upload at least one image in photos', 400))
    }

  const uploadedPhotos = []

  //upload photos to cloudinary
  photos.forEach(async photo => {
    const result = await cloudStorage(photo.tempFilePath)
    uploadedPhotos.push(result.secure_url)
  })

  console.log(uploadedPhotos)

  //convert price to pounds
  const priceToGBP = await convert(currency, 'GBP', unitPrice)
  const stripe_price = Number(priceToGBP + 20).toFixed(2)

  // add store id to price from stripe
  const metaData = { store: sellerStore.id }

  //get price id from stripe
  const price_id = await stripeUtil.createPrice(
    stripe_price * 100,
    name,
    metaData
  )

  //upload main photo then create product
  const resp = await cloudStorage(req.files.mainPhoto.tempFilePath)

  const product = await Product.create({
    sub_category: subcategory,
    name,
    description,
    returnPolicy,
    brand,
    sourceOfMaterial,
    attributes: {
      colors: parsed.colors,
      sizes: parsed.sizes,
    },
    availableQty,
    weight,
    unitPrice: priceToGBP + 20,
    originalPrice: unitPrice,
    mainPhoto: resp.secure_url,
    photos: uploadedPhotos,
    discount,
    height,
    width,
    weight,
    length,
    store: sellerStore.id,
    price_id: price_id.id,
  })

  res.status(201).json({
    status: 'success',
    message: 'product created successfully',
    data: product,
  })
}

module.exports = addProduct
