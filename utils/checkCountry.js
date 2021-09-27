const stripeSupportedCountries = require('./stripe/supportedCountries.json')


const convertToLowercase = data => {
  for (var i = 0; i < data.length; i++) {
    for (var key in data[i]) {
       if (typeof data[i][key] == 'string') {
        data[i][key] = data[i][key].toLowerCase()
      }
    }
  }
  return data
}
const check = (country) =>{
  //conert values to lower case
  const lowerCaseCountries = convertToLowercase(stripeSupportedCountries)
  lowerCaseCountries.map(item => {
    if (item.name === country.toLowerCase()) {
      return item
    } else {
      return false
    }
  })
}

module.exports = check