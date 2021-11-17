const {Schema, model} = require('mongoose')

const contactSchema = new Schema({
fullName:{
  type:String,
  requred:[true, 'Please tell us your full name']
},
email:{
  type:String,
  required:[true,'Please we require your email to get back to you']
},
phone:{
  type:String
},
message:{
  type:String,
  required:[true, 'Please enter your message']

}
},{timestamps:true})
module.exports = model('ContactUs', contactSchema)