const Error = require('../../utils/errorResponse')
const countries = require('../../utils/countries')


const getAllCountries = async (req,res,next) => {
  try{
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