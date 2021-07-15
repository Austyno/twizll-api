const jwt = require('jsonwebtoken')

//method to generate jwt login token
//TODO: add toekn expiration time
// {
// 		expiresIn: parseInt(process.env.JWT_EXPIRE),
// 	}
const generateJwtToken = id => {
	const token = jwt.sign({ id }, process.env.JWT_SECRET)
	return token
}
module.exports = generateJwtToken
