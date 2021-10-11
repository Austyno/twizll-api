const axios = require('axios')

const convertCurrency = async (from, to, amount) => {
  const result = await axios.get(
    `https://data.fixer.io/api/convert?access_key=${process.env.CURRENCY_CONVERTER_API_KEY}&from=${from}&to=${to}&amount=${amount}`
  )
  console.log(result.data.result)
  return result.data.result
}

module.exports = convertCurrency
