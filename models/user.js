// models/user.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile_no: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  date_of_birth: { type: Date, required: true },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  password: { type: String, required: true },
  otp: { type: String },
  otpExpires: { type: Date },
  isVerified: { type: Boolean, default: false },
  uploadedOn:{type:Date,default:Date.now},
});

// Prevent overwriting the User model if it already exists
const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;
