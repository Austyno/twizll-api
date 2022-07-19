const axios = require('axios')
const fs = require('fs')
const path = require('path')

function utcformat(d) {
  d = new Date(d)
  var tail = 'GMT+01:00',
    D = [d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate() + 10],
    T = [d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds()]
  if (+T[0] > 12) {
    T[0] -= 12
    tail = tail
  } else tail = tail
  var i = 3
  while (i) {
    --i
    if (D[i] < 10) D[i] = '0' + D[i]
    if (T[i] < 10) T[i] = '0' + T[i]
  }
  return D.join('-') + 'T' + T.join(':') + tail
}
const tD = new Date()
const deli = utcformat(tD)

const data = {
  productCode: 'P',

  plannedShippingDateAndTime: `${deli}`,
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
        cityName: 'Bloomfield Township',

        countryCode: 'US',

        postalCode: '48302',

        addressLine1: '4846 Hayhurst Lane',
      },

      contactInformation: {
        mobilePhone: '+16163516189',

        phone: '+12487613703',

        companyName: 'Null',

        fullName: 'Jane Doe',

        email: 'janedoe@gmail.com',
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
      number: '957285358',

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
        cityName: 'New York',

        countryCode: 'US',

        postalCode: '10001',

        addressLine1: '648 th Street',

        countyName: 'United States',
      },

      contactInformation: {
        mobilePhone: '+16163516189',

        phone: '+12487613703',

        companyName: 'Test Company 2',

        fullName: 'Jane Doe',

        email: 'janedoe@gmail.com',
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

            value: 1,
          },

          price: 13543,

          description: 'cotton throw pillow ',

          weight: {
            netValue: 0.5,

            grossValue: 0.5,
          },

          exportReasonType: 'permanent',

          manufacturerCountry: 'NG',
        },
      ],

      exportReason: 'Permanent',

      additionalCharges: [
        {
          value: 10000,

          typeCode: 'freight',
        },
      ],

      invoice: {
        number: '619cb8c54ef51816becf7113',

        date: '2022-01-15',
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
        weight: 2,

        description: '15 x 15 Ankara Cushion Cover',

        dimensions: {
          length: 10,

          width: 10,

          height: 55,
        },
      },
    ],

    declaredValueCurrency: 'GBP',

    declaredValue: 13543,
  },

  valueAddedServices: [
    {
      serviceCode: 'II',

      value: 13543,

      currency: 'GBP',
    },

    {
      serviceCode: 'WY',
    },
  ],

  customerReferences: [
    {
      value: '619cb8c54ef51816becf7113',

      typeCode: 'CU',
    },
  ],
}

axios
  .post('https://express.api.dhl.com/mydhlapi/test/shipments', data, {
    auth: {
      username: 'twizllnglimNG',
      password: 'C^5kU#4qP!0qT$1p',
    },
  })
  .then(res => {
    fs.writeFile(
      path.join(__dirname, '/pdfLabels/label.pdf'),
      res.data.documents[0].content,
      'base64',
      error => {
        if (error) {
          throw error
        }
        console.log('saved')
      }
    )
  })
  .catch(e => console.log(e.message))
