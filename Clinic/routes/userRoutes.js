        const express = require('express');
const router = express.Router();
const { auth, isAdmin } = require('../middleware/authMiddleware');
const User = require('../models/userModel');

router.get('/', auth, isAdmin, async (req,res)=>{ const users = await User.find(); res.json(users); });

router.delete('/:id', auth, isAdmin, async (req,res)=>{ await User.findByIdAndDelete(req.params.id); res.json({ message: 'User deleted' }); });

module.exports = router;
