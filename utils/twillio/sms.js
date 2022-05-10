const Twilio = require('twilio')
const accountSid = process.env.TWILLIO_ACCOUNT_SID
const authToken = process.env.TWILLIO_ACCOUNT_AUTH_TOKEN

// const sms = async (to, code) => {
//   const client = new Twilio(accountSid, authToken)
//   return new Promise(async (resolve,reject)=>{
//     try{

//       const message = await client.messages.create({
//           body: code,
//           to,
//           from: process.env.TWILLIO_PHONE_NUMBER,
//       })
//         resolve(message.sid)

//     }catch(e){
//       reject(e.message)
//     }
//   })
// }
const sms = (to, otp) => {
  const client = new Twilio(accountSid, authToken)

  client.messages
    .create({
      body: `Your verification code is ${otp}`,
      to: `'${to}'`,
      from: '+16075369405',
    })
    .then(msg => msg.id)
    .catch(e => console.log(e))
}

module.exports = sms
