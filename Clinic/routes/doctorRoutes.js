const express = require('express');
const router = express.Router();
const { auth, isAdmin } = require('../middleware/authMiddleware');
const ctrl = require('../controllers/doctorController');
router.get('/', auth, ctrl.getAll);
router.post('/', auth, isAdmin, ctrl.create);
router.patch('/:id', auth, isAdmin, ctrl.update);
router.delete('/:id', auth, isAdmin, ctrl.delete);
module.exports = router;
