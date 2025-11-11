const mongoose = require('mongoose');
const doctorSchema = new mongoose.Schema({
  name: String,
  specialization: String,
  availableDays: [String],
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Doctor', doctorSchema);
