const cloudinary = require('cloudinary').v2

const cloudDelete = filename => {
  cloudinary.config({
    cloud_name: 'dq59gbro3',
    api_key: 384628718881899,
    api_secret: 'nDZHzEGzbS2zNhBDNFhvKSV-4L0',
    shorten: true,
    secure: true,
    ssl_detected: true,
  })

  cloudinary.uploader.destroy(filename, { invalidate: true }, (err, result) => {
    if (err) {
      console.log(err)
    }
    console.log(result)
    return result
  })
}

module.exports = cloudDelete
