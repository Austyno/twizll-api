const validator = require('validator')
const bcrypt = require('bcryptjs')
const { Schema, model } = require('mongoose')
const mongoose = require('mongoose')

const buyerSchema = new Schema(
  {
    fullName: {
      type: String,
      trim: true,
      required: [true, 'Please tell us your first name!'],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: [true, 'Please provide your email address'],
      validate: [validator.isEmail, 'Please enter a valid email address'],
      index: true,
    },
    phone: {
      type: String,
      validate: [validator.isMobilePhone, 'please enter a valid mobile number'],
    },
    photo: {
      type: String,
      default: '',
    },
    password: {
      type: String,
      required: [true, 'Please provide your password'],
      minlength: [8, 'Password must be minimum of eight (8) characters'],
      validate(value) {
        if (value.toLowerCase().includes('password')) {
          throw new Error('Password can not contain "password"')
        } else if (value.toLowerCase().includes('12345678')) {
          throw new Error('Password can not contain "1235678"')
        }
      },
      select: false,
    },
    address: {
      type: String,
    },
    role: {
      type: String,
      lowercase: true,
      default: 'buyer',
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    social: {
      provider: {
        type: String,
      },
      id: {
        type: String,
      },
    },
    token: {
      type: String,
    },
    refreshToken: {
      _token: {
        type: String,
      },
      expiryDate: {
        type: Date,
      },
    },
    shippingAddress: {
      address: { type: String },
      country: { type: String },
      contactPerson: { type: String },
      postalCode: { type: Number },
      city: { type: String },
      countryCode: { type: String },
    },
    emailVerificationCode: String,
    emailCodeTimeExpiry: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },

  { toJSON: { virtuals: true } }
)

buyerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()

  this.password = await bcrypt.hash(this.password, 12)

  next()
})

buyerSchema.methods.isValidPassword = async function (
  userEnteredPassword,
  userSavedPassword
) {
  return await bcrypt.compare(userEnteredPassword, userSavedPassword)
}

module.exports = mongoose.models.Buyer || model('Buyer', buyerSchema)
