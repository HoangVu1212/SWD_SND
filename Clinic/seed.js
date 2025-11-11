const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('./models/userModel');
const Doctor = require('./models/doctorModel');
const Appointment = require('./models/appointmentModel');

async function seed(){
  try{
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to', process.env.MONGO_URI);
    await User.deleteMany();
    await Doctor.deleteMany();
    await Appointment.deleteMany();
    const adminPass = await bcrypt.hash('123456', 10);
    const userPass = await bcrypt.hash('123456', 10);

    const admin = await User.create({ username: 'admin1', password: adminPass, role: 'admin' });
    const user = await User.create({ username: 'user1', password: userPass, role: 'patient' });
    console.log('Users created:', admin.username, user.username);
const d1 = await Doctor.create({ name: 'Dr. A', specialization: 'Cardiology', availableDays: ['Mon','Wed'] });
const d2 = await Doctor.create({ name: 'Dr. B', specialization: 'Dermatology', availableDays: ['Tue','Thu'] });
await Appointment.create({ doctorId: d1._id, patientId: user._id, date: new Date(), time: '10:00' });

    console.log('Seed finished');
    process.exit(0);
  }catch(e){
    console.error(e);
    process.exit(1);
  }
}

seed();
