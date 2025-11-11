const Doctor = require('../models/doctorModel');
exports.create = async (req, res) => {
  const d = await Doctor.create(req.body);
  res.json(d);
};
exports.getAll = async (req, res) => {
  const list = await Doctor.find();
  res.json(list);
};
exports.update = async (req, res) => {
  const d = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(d);
};
exports.delete = async (req, res) => {
  await Doctor.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
};
