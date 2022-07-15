const Error = require('../../utils/errorResponse')
const Country = require('../../models/countries')


const getAllCountries = async (req,res,next) => {
  try{
    const countries = await Country.find()
  return res.status(200).json({
    status: 'success',
    message: 'countries retrieved successfully',
    data: countries,
  })
  }catch(e){
    next(e)
  }
}
module.exports = getAllCountries