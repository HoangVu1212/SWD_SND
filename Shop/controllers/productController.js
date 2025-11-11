const Product = require('../models/productModel');
exports.getAll = async (req, res) => {
  const prods = await Product.find();
  res.json(prods);
};
exports.create = async (req, res) => {
  const p = await Product.create(req.body);
  res.json(p);
};
exports.update = async (req, res) => {
  const p = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(p);
};
exports.delete = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
};
exports.search = async (req, res) => {
  const { category } = req.query;
  const filter = {};
  if(category) filter.category = new RegExp(category, 'i');
  const list = await Product.find(filter);
  res.json(list);
};
