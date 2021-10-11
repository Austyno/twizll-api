const nodemailer = require('nodemailer')
const path = require('path')
const ejs = require('ejs')
const API_KEY = process.env.MAILGUN_API_KEY
const DOMAIN = process.env.MAILGUN_DOMAIN
let mailgun = require('mailgun-js')({
  apiKey: API_KEY,
  domain: DOMAIN,
  host: 'api.eu.mailgun.net',
})

class SendEmail {
  withTemplate = async (dataObject, email, templateSource, subject) => {
    return new Promise((resolve, reject) => {
      let pathToTemplates = path.join(__dirname, '../public/views')
      ejs.renderFile(
        path.join(pathToTemplates, templateSource),
        dataObject,
        function (err, data) {
          if (err) {
            return reject(err.message)
          } else {
            var mailOptions = {
              from: 'Twizll Ltd info@mail.twizll.com',
              to: email,
              subject,
              html: data,
            }

            mailgun.messages().send(mailOptions, (error, body) => {
              if (error) {
                console.log(error)
                reject(error)
              } else {
                console.log(body)
                resolve(body)
              }
            })
          }
        }
      )
    })
  }
  notifyAdmin = async (emailAddress, subject, dataObject) => {
    return new Promise((resolve, reject) => {
      ejs.renderFile(
        path.join(__dirname, '../public/views/newUser.ejs'),
        dataObject,
        (err, data) => {
          if (err) {
            reject(err.message)
          } else {
            const options = {
              from: 'Twizll Ltd info@mail.twizll.com',
              to: emailAddress,
              subject,
              html: data,
            }

            mailgun.messages().send(options, (error, body) => {
              if (error) {
                console.log(error)
                reject(error)
              } else {
                console.log(body)
                resolve(body)
              }
            })
          }
        }
      )
    })
  }
}

module.exports = new SendEmail()
