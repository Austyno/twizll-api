const validator = require('validator')
const bcrypt = require('bcryptjs')
const { Schema, model } = require('mongoose')
const mongoose = require('mongoose')

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      trim: true,
      required: [true, 'Please tell us your first name!'],
    },
    googleUserId: {
      type: String,
    },
    facebookUserId: {
      type: String,
    },
    appleUserId: {
      type: String,
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
      validate: [validator.isMobilePhone, 'please enter a valid mobile phone'],
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
        }
      },
      select: false,
    },
    role: {
      type: String,
      lowercase: true,
      enum: ['user', 'admin', 'seller', 'stylist'],
      default: 'user',
    },
    emailVerified: {
      type: Boolean,
      default: false,
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

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()

  this.password = await bcrypt.hash(this.password, 12)

  next()
})

userSchema.methods.isValidPassword = async function (
  userEnteredPassword,
  userSavedPassword
) {
  return await bcrypt.compare(userEnteredPassword, userSavedPassword)
}

userSchema.virtual('stores', {
  ref: 'Store',
  localField: '_id',
  foreignField: 'owner',
  justOne: false,
})

module.exports = mongoose.models.User || model('User', userSchema)
