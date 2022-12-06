const Error = require('../../utils/errorResponse')
const Buyer = require('../../models/buyerModel')
const countries = require('../../utils/countries')
const Country = require('../../models/countries')

const shippingAddress = async (req, res, next) => {
  const buyer = req.user
  const { address, contactPerson, city, postalCode, country,phone} = req.body

  if (!buyer) {
    return next(new Error('The buyer needs to login', 400))
  }
  //get contry code
  let countryCode = ''
  const all_countries = await Country.find()
  for(let i = 0; i < all_countries.length; i++){
    if (all_countries[i].name.toString() === country.toString()) {
      countryCode = all_countries[i].code
      break
    }
  }
  try {
    // const currentBuyer = await Buyer.findById(buyer.id)
    buyer.shippingAddress.address = address
    buyer.shippingAddress.city = city
    buyer.shippingAddress.contactPerson = contactPerson
    buyer.shippingAddress.country = country
    buyer.shippingAddress.postalCode = postalCode
    buyer.shippingAddress.countryCode = countryCode.toUpperCase()
    buyer.shippingAddress.phone = phone

    await buyer.save({ validateBeforeSave: false })

    buyer.token = undefined
    buyer.password = undefined

    res.status(200).json({
      status: 'success',
      message: 'shipping address saved successfully',
      data: buyer,
    })
  } catch (e) {
    return next(new Error(e.message, 500))
  }
}
module.exports = shippingAddress
