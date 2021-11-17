const Error = require('../../utils/errorResponse')
const ContactUs = require('../../models/contactUsModel')
const sendMail = require('../../utils/sendMail')

const contactUs = async (req, res, next) => {
  const { email, message, phone, fullName } = req.body

  if (
    email === undefined ||
    message == undefined ||
    phone == undefined ||
    fullName == undefined
  ) {
    return next(
      new Error(
        'please fill in the missen fields. All fields are required',
        400
      )
    )
  }
  try {
    const contact = await ContactUs.create(req.body)
    //mail admin with details
    const data = {
      fullName,
      phone,
      email,
      message,
    }
    await sendMail.notifyAdmin(
      'info@twizll.com',
      'New Enquiry',
      data,
      'enquiry'
    )

    res.status(200).json({
      status: 'success',
      message: 'Your message has been recieved. we will get back to you soon',
      data: contact,
    })
  } catch (e) {
    return next(new Error(e.message))
  }
}
module.exports = contactUs
