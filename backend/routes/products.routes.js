const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { verifyToken, requireRole } = require('../middlewares/authMiddleware');

// Rutas públicas
router.get('/', productController.listarProductos);
router.get('/categorias', productController.listarCategorias);
router.get('/:id', productController.obtenerProducto);

// Rutas administrativas
router.post('/', verifyToken, requireRole('administrador'), productController.crearProducto);
router.put('/:id', verifyToken, requireRole('administrador'), productController.actualizarProducto);
router.delete('/:id', verifyToken, requireRole('administrador'), productController.eliminarProducto);

module.exports = router;