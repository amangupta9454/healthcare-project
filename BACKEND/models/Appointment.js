const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  address: { type: String, required: true },
  age: { type: Number, required: true },
  disease: { type: String, required: true },
  date: { type: Date, required: true },
  message: { type: String },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
});

module.exports = mongoose.model('Appointment', appointmentSchema);