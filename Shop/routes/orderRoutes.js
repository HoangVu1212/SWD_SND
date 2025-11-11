const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/authMiddleware');
const ctrl = require('../controllers/orderController');
router.post('/', auth, ctrl.create);
router.patch('/:id/complete', auth, ctrl.complete);
router.get('/', auth, ctrl.getAll);
module.exports = router;
