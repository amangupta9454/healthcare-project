const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true, enum: ['male', 'female', 'other'] },
  role: { type: String, required: true, enum: ['patient', 'doctor'] },
  email: { type: String, required: true, unique: true, lowercase: true },
  mobile: { type: String, required: true },
  aadhar: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  img: { type: String },
  shortDesc: { type: String },
  specialty: { type: String },
  experience: { type: String },
  qualifications: { type: String },
  otp: { type: String },
  otpExpires: { type: Date },
}, { timestamps: true });

// No pre-save hook for password hashing to avoid double hashing
// Ensure unique index on email
userSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model('User', userSchema);