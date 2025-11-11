const Appointment = require('../models/appointmentModel');
exports.create = async (req, res) => {
  const { doctorId, date, time } = req.body;
  const ap = await Appointment.create({ doctorId, patientId: req.user.id, date, time });
  res.json(ap);
};
exports.cancel = async (req, res) => {
  const ap = await Appointment.findById(req.params.id);
  if(!ap) return res.status(404).json({ message: 'Not found' });
  if(ap.patientId.toString() !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  ap.status = 'cancelled';
  await ap.save();
  res.json(ap);
};
exports.confirm = async (req, res) => {
  const ap = await Appointment.findById(req.params.id);
  if(!ap) return res.status(404).json({ message: 'Not found' });
  if(req.user.role !== 'doctor' && req.user.role !== 'admin') return res.status(403).json({ message: 'Only doctor/admin' });
  ap.status = 'confirmed';
  await ap.save();
  res.json(ap);
};
exports.getAll = async (req, res) => {
  let filter = {};
  if(req.user.role === 'patient') filter.patientId = req.user.id;
  if(req.user.role === 'doctor') filter.doctorId = req.user.id;
  const list = await Appointment.find(filter).populate('doctorId patientId');
  res.json(list);
};
