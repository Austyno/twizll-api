const path = require('path')
const VerificationDoc = require('../../models/verificationDocsModel')
const Error = require('../../utils/errorResponse')

const uploadDocs = async (req, res, next) => {
  const seller = req.user
  const sellerStore = req.store

  if (req.files.proofOfAddress) {
    const allowedMediaTypes = ['jpg', 'jpeg', 'png', 'pdf']

    const doc = req.files.proofOfAddress

    if (!allowedMediaTypes.includes(doc.mimetype.split('/')[1])) {
      return res.status(400).json({
        status: 'failed',
        message: `Media type ${
          doc.mimetype.split('/')[1]
        } is not allowed. Allowed doc types ${allowedMediaTypes}`,
        data: [],
      })
    }

    if (doc.size > 2000000) {
      return res.status(400).json({
        status: 'failed',
        message: `Upload file size is too large. Upload a file less than 2mb`,
        data: [],
      })
    }

    try {
      const newName = `${doc.name.split('.')[0]}-${Date.now()}${path.extname(
        doc.name
      )}`

      const upldPath = path.join(__dirname, '../../upload/')

      const docExist = await VerificationDoc.findOne({ store: sellerStore._id })

      if (!docExist) {
        //upload doc
        doc.mv(`${upldPath}/${newName}`, async err => {
          if (err) {
            return res.status(500).json({
              status: 'failed',
              message:
                'there was a problem with document upload. Please try again',
              data: [],
            })
          }
          //add doc to db
          await VerificationDoc.create({
            proofOfAddress: `../../upload/${newName}`,
            store: sellerStore.id,
          })

          //update store
          sellerStore.storeVerified = 'awaiting approval'
          sellerStore.save()

          res.status(201).json({
            status: 'success',
            message: 'Proof of Address uploaded successfully',
            data: [],
          })
        })
      } else {
        //upload doc
        doc.mv(`${upldPath}/${newName}`, async err => {
          if (err) {
            return res.status(500).json({
              status: 'failed',
              message:
                'there was a problem with document upload. Please try again',
              data: [],
            })
          }

          //update db with new doc
          await VerificationDoc.findOneAndUpdate(
            { store: sellerStore.id },
            {
              proofOfAddress: `../../upload/${newName}`,
            }
          )

          //update store
          sellerStore.storeVerified = 'awaiting approval'
          sellerStore.save()

          res.status(201).json({
            status: 'success',
            message: 'Proof of Address uploaded successfully',
            data: [],
          })
        })
      }
    } catch (e) {
      return next(new Error(e.message, 500))
    }
  }

  //upload proof of ID
  if (req.files.proofOfId) {
    const allowedMediaTypes = ['jpg', 'jpeg', 'png', 'pdf']

    const doc = req.files.proofOfId

    if (!allowedMediaTypes.includes(doc.mimetype.split('/')[1])) {
      return res.status(400).json({
        status: 'failed',
        message: `Media type ${
          doc.mimetype.split('/')[1]
        } is not allowed. Allowed doc types ${allowedMediaTypes}`,
        data: [],
      })
    }

    if (doc.size > 2000000) {
      return res.status(400).json({
        status: 'failed',
        message: `Upload file size is too large. Upload a file less than 2mb`,
        data: [],
      })
    }

    try {
      const newName = `${doc.name.split('.')[0]}-${Date.now()}${path.extname(
        doc.name
      )}`

      const upldPath = path.join(__dirname, '../../upload/')

      const docExist = await VerificationDoc.findOne({ store: sellerStore._id })

      if (!docExist) {
        //upload doc
        doc.mv(`${upldPath}/${newName}`, async err => {
          if (err) {
            return res.status(500).json({
              status: 'failed',
              message:
                'there was a problem with document upload. Please try again',
              data: [],
            })
          }
          //add doc to db
          await VerificationDoc.create({
            store: sellerStore._id,
            proofOfId: `../../upload/${newName}`,
          })

          //update store
          sellerStore.storeVerified = 'awaiting approval'
          sellerStore.save()

          res.status(201).json({
            status: 'success',
            message: 'Proof of ID uploaded successfully',
            data: [],
          })
        })
      } else {
        //upload doc
        doc.mv(`${upldPath}/${newName}`, async err => {
          if (err) {
            return next(
              new Error('there was a problem with document upload', 500)
            )
          }
          //update db with new doc
          await VerificationDoc.findOneAndUpdate(
            { store: sellerStore.id },
            {
              proofOfId: `../../upload/${newName}`,
            }
          )

          //update store
          sellerStore.storeVerified = 'awaiting approval'
          sellerStore.save()

          res.status(201).json({
            status: 'success',
            message: 'Proof of ID uploaded successfully',
            data: [],
          })
        })
      }
    } catch (e) {
      return next(e)
    }
  }
}

module.exports = uploadDocs
