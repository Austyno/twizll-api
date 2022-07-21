const axios = require('axios')

class DhlUtil {
  createLabel(buyer, product, qty, orderId, total) {
    function utcformat(d) {
      d = new Date(d)
      var tail = 'GMT+01:00',
        D = [d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate() + 10],
        T = [d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds()]
      if (+T[0] > 12) {
        T[0] -= 12
        tail = tail
      } else {
        tail = tail
      }
      var i = 3
      while (i) {
        --i
        if (D[i] < 10) {
          D[i] = '0' + D[i]
        }
        if (T[i] < 10) {
          T[i] = '0' + T[i]
        }
      }
      return D.join('-') + 'T' + T.join(':') + tail
    }

    const tD = new Date()
    const delivaryDate = utcformat(tD)

    const ts = Date.now()
    const currentDate = new Date(ts)
    const YYYY = currentDate.getFullYear()
    let MM = currentDate.getMonth() + 1
    const DD = currentDate.getDate()
    if (MM < 10) {
      MM = '0' + MM
    }
    console.log(`${YYYY + '-' + MM + '-' + DD}`)

    return new Promise(async (resolve, reject) => {
      const data = {
        productCode: 'P',

        plannedShippingDateAndTime: `${delivaryDate}`,
        pickup: {
          pickupDetails: {
            postalAddress: {
              cityName: 'East London',

              countryCode: 'GB',

              postalCode: 'E1 6AN',

              addressLine1: 'East London',

              countyName: 'London',
            },

            contactInformation: {
              mobilePhone: '+2347088554313',

              phone: '+2347088554313',

              companyName: 'Twizll Ltd',

              fullName: 'John Doe',

              email: 'austin@twizll.com',
            },

            typeCode: 'business',
          },

          pickupRequestorDetails: {
            postalAddress: {
              cityName: `${buyer.shippingAddress.city}`,

              countryCode: `${buyer.shippingAddress.countryCode}`,

              postalCode: `${buyer.shippingAddress.postalCode}`,

              addressLine1: `${buyer.shippingAddress.address}`,
            },

            contactInformation: {
              mobilePhone: `${buyer.phone}`,

              phone: `${buyer.phone}`,

              companyName: 'Null',

              fullName: `${buyer.fullName}`,

              email: `${buyer.email}`,
            },

            typeCode: 'business',
          },

          isRequested: false,
        },

        outputImageProperties: {
          allDocumentsInOneImage: true,

          encodingFormat: 'pdf',

          imageOptions: [
            {
              templateName: 'ECOM26_84_A4_001',

              typeCode: 'label',
            },

            {
              templateName: 'ARCH_8X4_A4_002',

              isRequested: true,

              typeCode: 'waybillDoc',

              hideAccountNumber: true,
            },

            {
              templateName: 'COMMERCIAL_INVOICE_P_10',

              invoiceType: 'commercial',

              languageCode: 'eng',

              isRequested: true,

              typeCode: 'invoice',
            },
          ],
        },

        accounts: [
          {
            number: process.env.DHL_SHIPPER_ACCOUNT_NUM,

            typeCode: 'shipper',
          },
        ],

        customerDetails: {
          shipperDetails: {
            postalAddress: {
              cityName: 'East London',

              countryCode: 'GB',

              postalCode: 'E1 6AN',

              addressLine1: 'East London',

              countyName: 'London',
            },

            contactInformation: {
              mobilePhone: '+2347088554313',

              phone: '+2347088554313',

              companyName: 'Twizll Ltd',

              fullName: 'Austin A',

              email: 'austin@twizll.com',
            },

            typeCode: 'business',
          },

          receiverDetails: {
            postalAddress: {
              cityName: `${buyer.shippingAddress.city}`,

              countryCode: `${buyer.shippingAddress.countryCode}`,

              postalCode: `${buyer.shippingAddress.postalCode}`,

              addressLine1: `${buyer.shippingAddress.address}`,

              countyName: `${buyer.shippingAddress.country}`,
            },

            contactInformation: {
              mobilePhone: `${buyer.phone}`,

              phone: `${buyer.phone}`,

              companyName: 'null',

              fullName: `${buyer.fullName}`,

              email: `${buyer.email}`,
            },

            typeCode: 'business',
          },
        },

        content: {
          exportDeclaration: {
            lineItems: [
              {
                number: 1,

                quantity: {
                  unitOfMeasurement: 'PCS',

                  value: qty,
                },

                price: product.unitPrice,

                description: product.briefDesc,

                weight: {
                  netValue: product.weight,

                  grossValue: product.weight,
                },

                exportReasonType: 'permanent',

                manufacturerCountry: 'NG',
              },
            ],

            exportReason: 'Permanent',

            additionalCharges: [
              {
                value: 2000,

                typeCode: 'freight',
              },
            ],

            invoice: {
              number: orderId,

              date: `${YYYY + '-' + MM + '-' + DD}`,
            },

            placeOfIncoterm: 'London',

            exportReasonType: 'permanent',

            shipmentType: 'personal',
          },

          unitOfMeasurement: 'metric',

          isCustomsDeclarable: true,

          incoterm: 'DAP',

          description: 'shipment description',

          packages: [
            {
              weight: product.weight,

              description: product.briefDesc,

              dimensions: {
                length: product.length,

                width: product.width,

                height: product.height,
              },
            },
          ],

          declaredValueCurrency: 'GBP',

          declaredValue: total,
        },
        customerReferences: [
          {
            value: orderId,

            typeCode: 'CU',
          },
        ],
      }
      // const data = {
      //   productCode: 'P',

      //   plannedShippingDateAndTime: `${deli}`,

      //   pickup: {
      //     pickupDetails: {
      //       postalAddress: {
      //         cityName: 'East London',

      //         countryCode: 'GB',

      //         postalCode: 'E1 6AN',

      //         addressLine1: 'East London',

      //         countyName: 'London',
      //       },

      //       contactInformation: {
      //         mobilePhone: '+2347088554313',

      //         phone: '+2347088554313',

      //         companyName: 'Twizll Ltd',

      //         fullName: 'Austin A',

      //         email: 'austin@twizll.com',
      //       },

      //       typeCode: 'business',
      //     },

      //     pickupRequestorDetails: {
      //       postalAddress: {
      //         cityName: buyer.shippingAddress.city,

      //         countryCode: buyer.shippingAddress.countryCode,

      //         postalCode: buyer.shippingAddress.postalCode,

      //         addressLine1: buyer.shippingAddress.address,
      //       },

      //       contactInformation: {
      //         mobilePhone: buyer.phone,

      //         phone: buyer.phone,

      //         companyName: 'null',

      //         fullName: buyer.fullName,

      //         email: buyer.email,
      //       },

      //       typeCode: 'business',
      //     },

      //     isRequested: false,
      //   },

      //   outputImageProperties: {
      //     allDocumentsInOneImage: true,

      //     encodingFormat: 'pdf',

      //     imageOptions: [
      //       {
      //         templateName: 'ECOM26_84_A4_001',

      //         typeCode: 'label',
      //       },

      //       {
      //         templateName: 'ARCH_8X4_A4_002',

      //         isRequested: true,

      //         typeCode: 'waybillDoc',

      //         hideAccountNumber: true,
      //       },

      //       {
      //         templateName: 'COMMERCIAL_INVOICE_P_10',

      //         invoiceType: 'commercial',

      //         languageCode: 'eng',

      //         isRequested: true,

      //         typeCode: 'invoice',
      //       },
      //     ],
      //   },

      //   accounts: [
      //     {
      //       number: process.env.DHL_SHIPPER_ACCOUNT_NUM,

      //       typeCode: 'shipper',
      //     },
      //   ],

      //   customerDetails: {
      //     shipperDetails: {
      //       postalAddress: {
      //         cityName: 'East London',

      //         countryCode: 'GB',

      //         postalCode: 'E1 6AN',

      //         addressLine1: 'East London',

      //         countyName: 'London',
      //       },

      //       contactInformation: {
      //         mobilePhone: '+2347088554313',

      //         phone: '+2347088554313',

      //         companyName: 'Twizll Ltd',

      //         fullName: 'Austin A',

      //         email: 'austin@twizll.com',
      //       },

      //       typeCode: 'business',
      //     },

      //     receiverDetails: {
      //       postalAddress: {
      //         cityName: buyer.shippingAddress.city,

      //         countryCode: buyer.shippingAddress.countryCode,

      //         postalCode: buyer.shippingAddress.postalCode,

      //         addressLine1: buyer.shippingAddress.address,

      //         countyName: buyer.shippingAddress.country,
      //       },

      //       contactInformation: {
      //         mobilePhone: buyer.phone,

      //         phone: buyer.phone,

      //         companyName: 'Null',

      //         fullName: buyer.fullName,

      //         email: buyer.email,
      //       },

      //       typeCode: 'business',
      //     },
      //   },

      //   content: {
      //     exportDeclaration: {
      //       lineItems: [
      //         {
      //           number: 1,

      //           quantity: {
      //             unitOfMeasurement: 'PCS',

      //             value: 1,
      //           },

      //           price: product.unitPrice,

      //           description: product.briefDesc,

      //           weight: {
      //             netValue: product.weight,

      //             grossValue: product.weight,
      //           },

      //           exportReasonType: 'permanent',

      //           manufacturerCountry: 'NG',
      //         },
      //       ],

      //       exportReason: 'Permanent',

      //       additionalCharges: [
      //         {
      //           value: 20,

      //           typeCode: 'freight',
      //         },
      //       ],

      //       invoice: {
      //         number: orderId,

      //         date: `${deli}`,
      //       },

      //       placeOfIncoterm: 'London',

      //       exportReasonType: 'permanent',

      //       shipmentType: 'personal',
      //     },

      //     unitOfMeasurement: 'metric',

      //     isCustomsDeclarable: true,

      //     incoterm: 'DAP',

      //     description: 'shipment description',

      //     packages: [
      //       {
      //         weight: product.weight,

      //         description: product.briefDesc,

      //         dimensions: {
      //           length: product.length,

      //           width: product.wight,

      //           height: product.height,
      //         },
      //       },
      //     ],

      //     declaredValueCurrency: 'GBP',

      //     declaredValue: total,
      //   },

      //   valueAddedServices: [
      //     {
      //       serviceCode: 'II',

      //       value: 20,

      //       currency: 'GBP',
      //     },

      //     {
      //       serviceCode: 'WY',
      //     },
      //   ],

      //   customerReferences: [
      //     {
      //       value: orderId,

      //       typeCode: 'CU',
      //     },
      //   ],
      // }
      try {
        const url =
          process.env.NODE_ENV === 'development'
            ? process.env.DHL_DEV_URL
            : process.env.DHL_PROD_URL
        
        const label = await axios.post(process.env.DHL_DEV_URL, data, {//remove dev url when production is ready
          auth: {
            username: process.env.DHL_USERNAME,
            password: process.env.DHL_PASSWORD,
          },
        })
        resolve({
          trackingId: label.data.packages[0].trackingNumber,
          label: label.data.documents[0].content,
        })
      } catch (e) {
        console.log(e.response.data.addtionDetails)
        reject(e)
      }
    })
  }
}
module.exports = new DhlUtil()
