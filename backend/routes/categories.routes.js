const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { verifyToken, requireRole } = require('../middlewares/authMiddleware');

// Ruta pública para listar categorías
router.get('/', categoryController.getCategories);

// Rutas protegidas (solo admin)
router.post('/', verifyToken, requireRole('administrador'), categoryController.createCategory);
router.put('/:id', verifyToken, requireRole('administrador'), categoryController.updateCategory);
router.delete('/:id', verifyToken, requireRole('administrador'), categoryController.deleteCategory);

module.exports = router;