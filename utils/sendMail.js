const nodemailer = require('nodemailer')
const path = require('path')
const { MailgunTransport } = require('mailgun-nodemailer-transport')
const transporter = nodemailer.createTransport(
  new MailgunTransport({
    auth: {
      domain: process.env.MAILGUN_DOMAIN,
      apiKey: process.env.MAILGUN_API_KEY,
    },
  })
)

class SendEmail {
  withTemplate = async (dataObject, email, templateSource, subject) => {
    return new Promise((resolve, reject) => {
      const ejs = require('ejs')
      let pathToTemplates = path.join(__dirname, '../public/views')
      ejs.renderFile(
        path.join(pathToTemplates, templateSource),
        dataObject,
        function (err, data) {
          if (err) {
            return reject(err)
          } else {
            var mainOptions = {
              from: '"twizll" <info@twizll.com>',
              to: email,
              subject,
              html: data,
            }

            transporter.sendMail(mainOptions, function (err, info) {
              if (err) {
                reject(err)
              } else {
                resolve(true)
              }
            })
          }
        }
      )
    })
  }
}

module.exports = new SendEmail()
