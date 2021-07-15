// const nodemailer = require("nodemailer")
// const {MailgunTransport} = require("mailgun-nodemailer-transport")
// const fs = require("fs")
// const path = require("path")
// const ejs = require('ejs');


// const mailgunAuth = {
//   auth: {
//     api_key: "key-d24d68a8c5cf560d8212a3d59d437c13",
//     domain: "sandbox20574995ef6942f6b8607d59c5e506ab.mailgun.org"
//   }
// }
// //create transporter
// const smtpTransport = nodemailer.createTransport(new MailgunTransport( mailgunAuth))

// //send mail
// const sendMail = async (dataObject, email,subject) => {
//     return new Promise((resolve, reject) => {
//       const ejs = require('ejs');
//       let template = path.join(__dirname, '../views/verify.ejs')
//       ejs.renderFile(
//         template,
//         dataObject,
//         function (err, data) {
//           if (err) {
//             console.log( "template error "+err)
//             return reject(err);
//           } else {
//             var mailOptions = {
//               from: '"twizll" <austin@twizll.com>',
//               to: email,
//               subject,
//               html: data,
//             };

//             smtpTransport.sendMail(mailOptions, function (err, info) {
//               if (err) {
//                 console.log("mail cant be sent "+err)
//                 reject(err)
//               }
//               else {
//                 console.log(info)
//                 resolve(true);
//               }
//             });
//           }
//         }
//       );
//     });
//   };

//   module.exports = sendMail

// const sgMail = require('@sendgrid/mail');
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const nodemailer = require("nodemailer");
const path = require('path')
const {MailgunTransport} = require("mailgun-nodemailer-transport");
const transporter = nodemailer.createTransport(
  new MailgunTransport({
    auth: {
      domain: "sandbox20574995ef6942f6b8607d59c5e506ab.mailgun.org",
      apiKey: "key-d24d68a8c5cf560d8212a3d59d437c13",
    },
  })
);

class SendEmail {
  withTemplate = async (dataObject, email, templateSource, subject) => {
    return new Promise((resolve, reject) => {
      const ejs = require('ejs');
      let pathToTemplates = path.join(__dirname, '../views')
      ejs.renderFile(
        path.join(pathToTemplates, templateSource),
        dataObject,
        function (err, data) {
          if (err) {
            console.log("data error"+ err)
            return reject(err);
          } else {
            var mainOptions = {
              from: '"twizll" <austin@twizll.com>',
              to: email,
              subject,
              html: data,
            };

            transporter.sendMail(mainOptions, function (err, info) {
              if (err) {
                console.log("sending email failed "+ err)
                reject(err)}
              else {
                resolve(true);
              }
            });
          }
        }
      );
    });
  };
}

module.exports = new SendEmail();