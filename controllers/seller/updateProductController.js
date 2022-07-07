const Store = require('../../models/storeModel')
const Product = require('../../models/productModel')
const Error = require('../../utils/errorResponse')
const cloudStorage = require('../../utils/uploadToCloudinary')
const convert = require('../../utils/convertCurrentcy')
const path = require('path')
const fs = require('fs')

//TODO:refactor to only upload images if they were changed and not the same with what was there b4
// also abort if there is an error -- use transactions

// TODO: refactor the whole endpoint
// create a cron job to delete tem images
const updateProduct = async (req, res, next) => {
  const { productId } = req.params
  const {
    name,
    unitPrice,
    briefDesc,
    height,
    weight,
    length,
    width,
    brand,
    description,
    availableQty,
    attributes,
    returnPolicy,
    sourceOfMaterial,
    percentageDiscount,
    currency,
    originalPrice,
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
  try {
    const productToUpdate = await Product.findById(productId)

    if (productToUpdate === null) {
      return res.status(400).json({
        status: 'failed',
        message: `The product does not exist`,
        data: '',
      })
    }

    if (productToUpdate.store.toString() === sellerStore.id.toString()) {
      const data = {}

      if (name) {
        data.name = name
      }
      if (unitPrice) {
        data.unitPrice = originalPrice
          ? await convert(currency, 'GBP', originalPrice)
          : await convert(currency, 'GBP', unitPrice)
      }
      if (briefDesc) {
        data.briefDesc = briefDesc
      }
      if (height) {
        data.height = Number(height)
      }
      if (weight) {
        data.weight = Number(weight)
      }
      if (length) {
        data.length = Number(length)
      }
      if (width) {
        data.weight = Number(width)
      }
      if (brand) {
        data.brand = brand
      }
      if (description) {
        data.description = description
      }
      if (availableQty) {
        data.availableQty = availableQty
      }
      if (attributes) {
        data.attributes = JSON.parse(attributes)
      }
      if (returnPolicy) {
        data.returnPolicy = returnPolicy
      }
      if (sourceOfMaterial) {
        data.sourceOfMaterial = sourceOfMaterial
      }
      if (percentageDiscount) {
        data.percentageDiscount = percentageDiscount
      }
      if (currency) {
        data.currency = currency
      }

      if (originalPrice) {
        data.originalPrice = originalPrice
      }

      if (req.files && req.files.mainPhoto) {
        const upl = await cloudStorage(req.files.mainPhoto.tempFilePath)
        data.mainPhoto = upl.secure_url
      }

      if (req.files && req.files.photos && Array.isArray(req.files.photos)) {
        let updatedPhotos = []
        req.files.photos.forEach(async photo => {
          const result = await cloudStorage(photo.tempFilePath)
          updatedPhotos.push(result.secure_url)
        })
        data.photos = updatedPhotos
      }
      if (req.files && req.files.photos) {
        const result = await cloudStorage(req.files.photos.tempFilePath)
        data.photos = result.secure_url
      }

      const updated = await Product.findOneAndUpdate(
        { _id: productId },
        { $set: data },
        { new: true }
      )

      return res.status(200).json({
        status: 'success',
        message: 'product updated successfully',
        data: updated,
      })
    } else {
      return res.status(403).json({
        status: 'failed',
        message: 'you can only update products that belong to your store',
        data: '',
      })
    }
  } catch (e) {
    next(e)
  }

  //   if (proToUpdate.store == sellerStore.id) {

  // if (req.files.photos && Array.isArray(photos)) {
  //   photos.forEach(photo => {
  //     cloudStorage(photo.tempFilePath)
  //       .then(result => {
  //         updatedPhotos.push(result.secure_url)
  //         console.log(result)
  //         const tmpFilePath = path.join(__dirname, '../../tmp/')
  //         fs.unlink(
  //           `${tmpFilePath + result.original_filename}`,
  //           (err, reslt) => {
  //             if (!err) {
  //               console.log('file deleted')
  //             }
  //           }
  //         )
  //       })
  //       .catch(e => console.log(e))
  //   })
  // }
  //     let updateMainPhoto
  //     if (req.files && req.files.mainPhoto) {
  //       cloudStorage(req.files.mainPhoto.tempFilePath).then(async result => {
  //         updateMainPhoto = result.secure_url
  //       })
  //     }
  //     let priceToGBP
  //     if (unitPrice) {
  //       priceToGBP = await convert(currency, 'GBP', unitPrice)
  //       originalPrice = unitPrice
  //     } else if (originalPrice) {
  //       priceToGBP = await convert(currency, 'GBP', originalPrice)
  //     }

  //     let parsedAttributes

  //     if (attributes) {
  //       parsedAttributes = JSON.parse(attributes)
  //     }

  //     try {
  //       const updateProduct = await Product.findOneAndUpdate(
  //         { _id: productId },
  //         {
  //           $set: {
  //             name: name ? name : proToUpdate.name,
  //             unitPrice: unitPrice
  //               ? Number(priceToGBP + 20)
  //               : proToUpdate.unitPrice,
  //             originalPrice: originalPrice
  //               ? originalPrice
  //               : proToUpdate.originalPrice,
  //             photos:
  //               updatedPhotos.length > 0 ? updatedPhotos : proToUpdate.photos,
  //             weight: Number(weight) ? Number(weight) : proToUpdate.weight,
  //             length: Number(length) ? Number(length) : proToUpdate.length,
  //             height: Number(height) ? Number(height) : proToUpdate.height,
  //             width: Number(width) ? Number(width) : proToUpdate.width,
  //             brand: brand ? brand : proToUpdate.brand,
  //             description: description ? description : proToUpdate.description,
  //             mainPhoto: updateMainPhoto
  //               ? updateMainPhoto
  //               : proToUpdate.mainPhoto,
  //             availableQty: Number(availableQty)
  //               ? Number(availableQty)
  //               : proToUpdate.availableQty,
  //             briefDesc: briefDesc ? briefDesc : proToUpdate.briefDesc,
  //             attributes: attributes
  //               ? {
  //                   colors: parsedAttributes.colors,
  //                   sizes: parsedAttributes.sizes,
  //                 }
  //               : proToUpdate.attributes,
  //             returnPolicy: returnPolicy
  //               ? returnPolicy
  //               : proToUpdate.returnPolicy,
  //             sourceOfMaterial: sourceOfMaterial
  //               ? sourceOfMaterial
  //               : proToUpdate.sourceOfMaterial,
  //             percentageDiscount: Number(percentageDiscount)
  //               ? Number(percentageDiscount)
  //               : proToUpdate.percentageDiscount,
  //           },
  //         },
  //         { new: true }
  //       )
  //       res.status(201).json({
  //         status: 'success',
  //         message: 'product updated successfully',
  //         data: updateProduct,
  //       })
  //     } catch (e) {
  //       return next(e)
  //     }
  //   } else {
  //     return next(
  //       new Error('you can only update products that belong to your store', 400)
  //     )
  //   }
}

module.exports = updateProduct
// name: Rauf Nrok,
// brand: gi,
// weight: 20,
// height: 20,
// unitPrice: 140,
// percentageDiscount: 10,
// attributes: {"colors":["FF0000", "000000"], "sizes":["M", "S"]},
// currency: NGN,
// description: beautiful designer T-shirt for all ocassions ,
// briefDesc: beautiful designer T-shirt for all ocassions ,
// sourceOfMaterial: fo, returnPolicy: gals retrrrrn,
// availableQty: 410,
// width: 50,
// length: 20
