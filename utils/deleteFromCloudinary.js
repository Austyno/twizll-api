const cloudinary = require('cloudinary').v2

const cloudDelete = filename => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    shorten: true,
    secure: true,
    ssl_detected: true,
  })

  cloudinary.uploader.destroy(filename, result => {
    console.log(result)
    return result
  })
}

module.exports = cloudDelete
