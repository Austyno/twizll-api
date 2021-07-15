const validator = require('validator');
const bcrypt = require('bcryptjs');
const { Schema, model } = require('mongoose');
const Crypto = require('crypto-js')

const userSchema = new Schema({
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
    index: true
  },
  phone: {
    type: String,
    validate:[validator.isMobilePhone,'please enter a valid mobile phone']
  },
  photo: {
    default: '',
    type: String
  },
  password: {
    type: String,
    required: [true, 'Please provide your password'],
    minlength: [8, 'Password must be minimum of eight (8) characters'],
    validate(value) {
      if (value.toLowerCase().includes('password')) {
        throw new Error('Password can not contain "password"');
      }
    },
    select: false,
  },
  role: {
    type: String,
    lowercase: true,
    enum: ['user', 'admin', 'vendor'],
    default: 'user',
  },
  emailVerified:{
      type:Boolean,
      default:false
  },
  docsVerified:{
      type:Boolean,
      default:false
  },
  emailVerificationCode: String,
  emailCodeTimeExpiry: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
}, {timestamps: true});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  next();
});


userSchema.methods.isValidPassword = async function (
  userEnteredPassword,
  userSavedPassword
) {
  return await bcrypt.compare(userEnteredPassword, userSavedPassword);
};

// userSchema.methods.emailVerification = function () {

//  const code = Crypto.randomBytes(30).toString('hex')

//   // Save code into the DB
//   this.emailVerificationCode = code;

//   // SAVE OTP EXPIRY TIME - 24 hours
//   this.emailCodeTimeExpiry = Date.now() + 24 * 60 * 60 * 1000

//   return code;
// };

module.exports = model('User', userSchema)