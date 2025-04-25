const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fileType: { type: String, enum: ['pdf', 'image'], required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Document', documentSchema);