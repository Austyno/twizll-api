const Seller = require('../models/sellerModel')
const sendMail = require('../utils/sendMail')

const Store = require('../models/storeModel')

module.exports = {
  async deactivateFreeTrial() {
    const docs = await Seller.find({ 'free_trial.status': 'active' })
    for (let i = 0; i < docs.length; i++) {
      if (docs[i].free_trial.end_date < Date.now()) {
        docs[i].free_trial.status = 'completed'

        await docs[i].save({ validateBeforeSave: false })

        //deactivate store subscription
        const userStore = Store.findOne({ owner: docs[i]._id })
        if (userStore) {
          userStore.activeSubscription = false
          await userStore.save({ validateBeforeSave: false })
        }

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
  async checkSubscription() {
    const docs = await Seller.find({ 'free_trial.status': 'active' })
  },
}
