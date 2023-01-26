const Seller = require('../models/sellerModel')
const sendMail = require('../utils/sendMail')

module.exports = {
  async deactivateFreeTrial() {
    const docs = await Seller.find({ 'free_trial.status': 'active' })
    for (let i = 0; i < docs.length; i++) {
      if (docs[i].free_trial.end_date < Date.now()) {
        docs[i].free_trial.status = 'completed'
        await docs[i].save({ validateBeforeSave: false })
        //send mail
        const mail = sendMail.withTemplate(
          { fullName: docs[i].fullName },
          docs[i].email,
          'free-trial-end.ejs',
          'Your Free trial has expired'
        )
      }
    }
  },
}
