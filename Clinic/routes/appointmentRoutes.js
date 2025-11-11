const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/authMiddleware');
const ctrl = require('../controllers/appointmentController');
router.post('/', auth, ctrl.create);
router.patch('/:id/cancel', auth, ctrl.cancel);
router.patch('/:id/confirm', auth, ctrl.confirm);
router.get('/', auth, ctrl.getAll);
module.exports = router;
