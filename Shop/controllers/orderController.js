const Order = require('../models/orderModel');
const Product = require('../models/productModel');
exports.create = async (req, res) => {
  const { items } = req.body; // [{ productId, quantity }]
  let total = 0;
  for(const it of items){
    const p = await Product.findById(it.productId);
    if(!p || p.stock < it.quantity) return res.status(400).json({ message: 'Insufficient stock for ' + (p? p.name: it.productId) });
    p.stock -= it.quantity;
    await p.save();
    total += p.price * it.quantity;
  }
  const order = await Order.create({ userId: req.user.id, items, totalPrice: total });
  res.json(order);
};
exports.complete = async (req, res) => {
  const o = await Order.findById(req.params.id);
  if(!o) return res.status(404).json({ message: 'Not found' });
  o.status = 'completed';
  await o.save();
  res.json(o);
};
exports.getAll = async (req, res) => {
  const filter = req.user.role === 'customer' ? { userId: req.user.id } : {};
  const list = await Order.find(filter).populate('items.productId userId');
  res.json(list);
};
