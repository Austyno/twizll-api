const Seller = require('../../models/sellerModel')
const Store = require('../../models/storeModel')
const VerificationDoc = require('../../models/verificationDocsModel')
const bcrypt = require('bcryptjs')
const signJWT = require('../../utils/generateToken')

const sellerLoginWeb = async (req, res, next) => {
  const { email, password } = req.body

  if (!email) {
    return res.status(400).json({
      status: 'failed',
      message: 'email is required',
      data: [],
    })
  }

  if (!password) {
    return res.status(400).json({
      status: 'failed',
      message: 'password is required',
      data: [],
    })
  }

  try {
    const user = await Seller.findOne({ email }).select('+password')

    if (!user) {
      return res.status(400).json({
        status: 'failed',
        message: 'incorect credentials',
        data: [],
      })
    }

    const verifyPass = bcrypt.compareSync(password, user.password)

    if (!verifyPass) {
      return res.status(400).json({
        status: 'failed',
        message: 'incorect credentials',
        data: [],
      })
    }
    const token = signJWT(user._id)
    user.token = token
    await user.save()
    const store = await Store.findOne({ owner: user._id })
    const storeRegistered = store != null && store.length > 0 ? true : false
    let proofOfId = false
    let proofOfAddress = false

    if (store != null) {
      const docs = await VerificationDoc.findOne({ store: store._id })
      if (docs != null) {
        proofOfId = docs.proofOfId != null ? true : false
        proofOfAddress = docs.proofOfAddress != null ? true : false
      }
    }
    user.password = undefined
    return res.status(200).json({
      status: 'success',
      message: 'seller logged in',
      data: {
        storeRegistered,
        proofOfId,
        proofOfAddress,
        user,
      },
    })
  } catch (e) {
    return next(e)
  }
}

module.exports = sellerLoginWeb
