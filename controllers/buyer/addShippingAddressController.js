const Error = require('../../utils/errorResponse')
const Buyer = require('../../models/buyerModel')
const countries = require('../../utils/countries')

const shippingAddress = async (req, res, next) => {
  const buyer = req.user
  const { address, contactPerson, city, postalCode, country } = req.body

  if (!buyer) {
    return next(new Error('The buyer needs to login', 400))
  }
  //get contry code
  let countryCode = ''
  for(let i = 0; i < countries.length; i++){
    if(countries[i].label === country){
      countryCode = countries[i].code
      return
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
