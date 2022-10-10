const { Schema, model } = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
  name: { type: String, required: [true, 'There is no name'], unique: true },
  email: {
    type: String,
    required: [true, 'There is no email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, ' Enter valid email'],
  },
  role: {
    type: String,
    enum: ['viewr', 'editor'],
    default: 'editor',
  },
  password: {
    type: String,
    required: [true, 'There is no password'],
    select: false,
  },
});

// Virtual populate
userSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = model('Users', userSchema);
module.exports = User;
