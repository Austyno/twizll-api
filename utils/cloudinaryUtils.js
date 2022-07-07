const cloudinary = require('cloudinary').v2


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

module.exports = {
  async uploadImage(image, folder) {
    try {
      const result = await cloudinary.uploader.upload(image, { folder })

      return result
    } catch (error) {
      console.log('Cloudinary: ', error)
    }
  },

  async deleteFile(id) {
    try {
      return await cloudinary.uploader.destroy(id)
    } catch (err) {
      console.log('Cloudinary: ', error)
    }
  },
}
