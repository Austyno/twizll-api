const Buyer = require('../../models/buyerModel')
const Seller = require('../../models/sellerModel')
const Stylist = require('../../models/stylistModel')
const Error = require('../../utils/errorResponse')


const logOut = async (req, res, next) => {
  const { role } = req.body

  res.cookie('token', 'loggedout', {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true,
  })

  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1]
  }

 
  //get db from role
  const dbModel =
    role === 'buyer'
      ? Buyer
      : role === 'seller'
      ? Seller
      : role === 'stylist'
      ? Stylist
      : null

  //ensure token  is in the db
  const user = await dbModel.findOne({ token })



  if(!user){
    return next(new Error('you do not have an active session'))
  }

  user.token = undefined
  await user.save({ saveBeforeSave: false })

  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully.',
  })
}
module.exports = logOut
