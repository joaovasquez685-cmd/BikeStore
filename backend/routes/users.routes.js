const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, requireRole } = require('../middlewares/authMiddleware');

// Todas las rutas requieren rol administrador
router.use(verifyToken, requireRole('administrador'));

router.get('/', userController.getAllUsers);
router.patch('/:id/status', userController.toggleUserStatus);

module.exports = router;