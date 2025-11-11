const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('./models/userModel');
const Product = require('./models/productModel');
const Order = require('./models/orderModel');

async function seed(){
  try{
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to', process.env.MONGO_URI);
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    const adminPass = await bcrypt.hash('123456', 10);
    const userPass = await bcrypt.hash('123456', 10);

    const admin = await User.create({ username: 'admin1', password: adminPass, role: 'admin' });
    const user = await User.create({ username: 'user1', password: userPass, role: 'customer' });
    console.log('Users created:', admin.username, user.username);
await Product.insertMany([
  { name: 'Sneakers', category: 'Shoes', price: 1200000, stock: 10 },
  { name: 'T-Shirt', category: 'Clothing', price: 200000, stock: 20 }
]);

    console.log('Seed finished');
    process.exit(0);
  }catch(e){
    console.error(e);
    process.exit(1);
  }
}

seed();
