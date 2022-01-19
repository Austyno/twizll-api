const axios = require('axios')

const convertCurrency = (from, to, amount) => {
  console.log('convertin....')
  return new Promise(async (resolve, reject) => {
    try {
      const result = await axios.get(
        `https://data.fixer.io/api/convert?access_key=${process.env.CURRENCY_CONVERTER_API_KEY}&from=${from}&to=${to}&amount=${amount}`
      )
      resolve(result.data.result)
    } catch (e) {
      reject(e)
    }
  })
}

module.exports = convertCurrency

