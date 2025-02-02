const validator = require('validator')
const bcrypt = require('bcryptjs')
const { Schema, model } = require('mongoose')
const mongoose = require('mongoose')

const stylistSchema = new Schema(
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
    social_handle: {
      type: String,
      required: [true, 'Please provide a valid social media handle'],
    },
    country: {
      type: Schema.Types.ObjectId,
      ref: 'Country',
    },
    style_name: {
      type: String,
      required: [true, 'style name is required'],
    },
    role: {
      type: String,
      lowercase: true,
      default: 'stylist',
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
    followers: [{ type: Schema.Types.ObjectId, ref:'Buyer'}],
    emailVerificationCode: String,
    emailCodeTimeExpiry: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    followers: [{ ref: 'Buyer', type: Schema.Types.ObjectId }],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },

  { toJSON: { virtuals: true } }
)

stylistSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()

  this.password = await bcrypt.hash(this.password, 12)

  next()
})

stylistSchema.methods.isValidPassword = async function (
  userEnteredPassword,
  userSavedPassword
) {
  return await bcrypt.compare(userEnteredPassword, userSavedPassword)
}

stylistSchema.virtual('store', {
  ref: 'Store',
  localField: '_id',
  foreignField: 'owner',
  justOne: false,
})

module.exports = mongoose.models.Stylist || model('Stylist', stylistSchema)
