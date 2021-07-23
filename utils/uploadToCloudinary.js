const cloudinary = require('cloudinary').v2

const cloudStorage = filename => {
  return new Promise((resolve, reject) => {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      shorten: true,
      secure: true,
      ssl_detected: true,
    })

    cloudinary.uploader
      .upload(filename, { use_filename: true, folder: 'twizll' })
      .then(result => {
        resolve(result)
        console.log(result)
      })
      .catch(error => {
        reject(error)
        console.log(error)
      })
  })
}

module.exports = cloudStorage
