const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  doctorNumber: { type: Number, required: true, unique: true},
  name: { type: String, required: true },
  daysWorked: { type: Number, required: true },
  salaryPerDay: { type: Number, required: true },
});

module.exports = mongoose.model('Doctor', doctorSchema);
