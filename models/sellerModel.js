const validator = require('validator')
const bcrypt = require('bcryptjs')
const { Schema, model } = require('mongoose')
const mongoose = require('mongoose')

const sellerSchema = new Schema(
  {
    fullName: {
      type: String,
      trim: true,
      required: [true, 'Please tell us your first name!'],
    },
    stripe_customer_id: {
      type: String,
      default: '',
    },
    free_trial: {
      status: {
        type: String,
        enum: ['active', 'completed'],
      },
      end_date: {
        type: Date,
      },
    },
    plan: {
      status: {
        type: String,
        // enum: ['active', 'expired'],
      },
      type: {
        type: String,
        enum: ['month', 'year', 'none'],
        default: 'none',
      },
      end_date: {
        type: Date,
      },
      start_date: {
        type: Date,
      },
    },
    social: {
      provider: {
        type: String,
      },
      id: {
        type: String,
      },
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
    address: {
      type: String,
    },
    role: {
      type: String,
      lowercase: true,
      default: 'seller',
    },
    emailVerified: {
      type: Boolean,
      default: false,
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

sellerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()

  this.password = await bcrypt.hash(this.password, 12)

  next()
})

sellerSchema.methods.isValidPassword = async function (
  userEnteredPassword,
  userSavedPassword
) {
  return await bcrypt.compare(userEnteredPassword, userSavedPassword)
}

sellerSchema.virtual('store', {
  ref: 'Store',
  localField: '_id',
  foreignField: 'owner',
  justOne: false,
})

module.exports = mongoose.models.Seller || model('Seller', sellerSchema)
