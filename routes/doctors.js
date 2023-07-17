const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');

// Get all doctors data
router.get('/doctors', async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});


// Create new doctor data
router.post('/doctors', async (req, res) => {
  try {
    const { doctorNumber, name, daysWorked, salaryPerDay } = req.body;
    const doctor = new Doctor({
      doctorNumber,
      name,
      daysWorked,
      salaryPerDay,
    });
    await doctor.save();
    res.json(doctor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});


// Update doctor data
router.put('/doctors/:id', async (req, res) => {
  try {
    const { doctorNumber, name, daysWorked, salaryPerDay } = req.body;
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      {
        doctorNumber,
        name,
        daysWorked,
        salaryPerDay,
      },
      { new: true }
    );
    res.json(doctor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete doctor data
router.delete('/doctors/:id', async (req, res) => {
  try {
    await Doctor.findByIdAndDelete(req.params.id);
    res.json({ message: 'Doctor deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

