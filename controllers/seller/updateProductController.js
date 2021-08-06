const Store = require('../../models/storeModel')
const Product = require('../../models/productModel')
const Error = require('../../utils/errorResponse')
const cloudStorage = require('../../utils/uploadToCloudinary')

//TODO:refactor to only upload images if they were changed and not the same with what was there b4
// also abort if there is an error -- use transactions
const updateProduct = async (req, res, next) => {
  const { productId } = req.params
  const {
    name,
    unitPrice,
    weight,
    brand,
    description,
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

  if(req.files && req.files.photos){

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
  if(req.files && req.files.mainPhoto){
    cloudStorage(req.files.mainPhoto.tempFilePath).then( async result => {
      updateMainPhoto = result.secure_url
    })
  }

try{
  const updateProduct = await Product.findByIdAndUpdate(
    productId,
    {
      name,
      unitPrice,
      photos: updatedPhotos.length > 0 ? updatedPhotos : undefined,
      weight,
      brand,
      description,
      mainPhoto: updateMainPhoto ? updateMainPhoto : undefined,
      totalNoOfUnits,
      attributes,
      returnPolicy,
      sourceOfMaterial,
    },
    { new: true }
  )
  res.status(201).json({
    status: 'success',
    message: 'product updated successfully',
    data: updateProduct,
  })

}catch(e){
  return next(new Error(e.message,500))
}
    

}
module.exports = updateProduct
