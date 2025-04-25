const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number },
  gender: { type: String },
  mobile: { type: String },
  aadhar: { type: String },
  role: { type: String, enum: ['patient', 'doctor'], required: true },
  shortDesc: { type: String }, // For doctors
  specialty: { type: String }, // For doctors
  experience: { type: String }, // For doctors
  qualifications: { type: String }, // For doctors
  isBlocked: { type: Boolean, default: false }, // For blocking doctors/patients
  otp: { type: String }, // Store OTP temporarily
  otpExpires: { type: Date }, // OTP expiration
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);