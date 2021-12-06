const Store = require('../../models/storeModel')
const Product = require('../../models/productModel')
const Error = require('../../utils/errorResponse')
const cloudStorage = require('../../utils/uploadToCloudinary')
const convert = require('../../utils/convertCurrentcy')

//TODO:refactor to only upload images if they were changed and not the same with what was there b4
// also abort if there is an error -- use transactions
const updateProduct = async (req, res, next) => {
  const { productId } = req.params
  const {
    name,
    unitPrice,
    photos,
    briefDesc,
    height,
    weight,
    length,
    width,
    brand,
    description,
    mainPhoto,
    availableQty,
    attributes,
    returnPolicy,
    sourceOfMaterial,
    percentageDiscount,
    currency
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

  if (proToUpdate.store == sellerStore.id) {
    let updatedPhotos = []

    if (req.files && req.files.photos) {
      photos.forEach(photo => {
        cloudStorage(photo.tempFilePath)
          .then(result => {
            updatedPhotos.push(result.secure_url)
            console.log(result)
            const tmpFilePath = path.join(__dirname, '../../tmp/')
            fs.unlink(
              `${tmpFilePath + result.original_filename}`,
              (err, reslt) => {
                if (!err) {
                  console.log('file deleted')
                }
              }
            )
          })
          .catch(e => console.log(e))
      })
    }
    let updateMainPhoto
    if (req.files && req.files.mainPhoto) {
      cloudStorage(req.files.mainPhoto.tempFilePath).then(async result => {
        updateMainPhoto = result.secure_url
      })
    }
    let converted
    if (unitPrice) {
        converted = await convert(currency, 'GBP', unitPrice)
    }

    let parsedAttributes

    if (attributes) {
      parsedAttributes = JSON.parse(attributes)
    }

    try {
      const updateProduct = await Product.findOneAndUpdate(
        { _id: productId },
        {
          $set: {
            name: name ? name : proToUpdate.name,
            unitPrice: unitPrice ? Number(converted) : proToUpdate.unitPrice,
            photos:
              updatedPhotos.length > 0 ? updatedPhotos : proToUpdate.photos,
            weight: Number(weight) ? Number(weight) : proToUpdate.weight,
            length: Number(length) ? Number(length) : proToUpdate.length,
            height: Number(height) ? Number(height) : proToUpdate.height,
            width: Number(width) ? Number(width) : proToUpdate.width,
            brand: brand ? brand : proToUpdate.brand,
            description: description ? description : proToUpdate.description,
            mainPhoto: updateMainPhoto
              ? updateMainPhoto
              : proToUpdate.mainPhoto,
            availableQty: Number(availableQty)
              ? Number(availableQty)
              : proToUpdate.availableQty,
            briefDesc: briefDesc ? briefDesc : proToUpdate.briefDesc,
            attributes: attributes
              ? {
                  colors: parsedAttributes.colors,
                  sizes: parsedAttributes.sizes,
                }
              : proToUpdate.attributes,
            returnPolicy: returnPolicy
              ? returnPolicy
              : proToUpdate.returnPolicy,
            sourceOfMaterial: sourceOfMaterial
              ? sourceOfMaterial
              : proToUpdate.sourceOfMaterial,
            percentageDiscount: Number(percentageDiscount)
              ? Number(percentageDiscount)
              : proToUpdate.percentageDiscount,
          },
        },
        { new: true }
      )
      res.status(201).json({
        status: 'success',
        message: 'product updated successfully',
        data: updateProduct,
      })
    } catch (e) {
      return next(new Error(e.message, 500))
    }
  } else {
    return next(
      new Error('you can only update products that belong to your store', 400)
    )
  }
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
