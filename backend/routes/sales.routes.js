const express = require('express');
const router = express.Router();
const saleController = require('../controllers/saleController');
const { verifyToken, requireRole } = require('../middlewares/authMiddleware');

// Rutas protegidas (Cliente y Admin)
router.post('/', verifyToken, saleController.processCheckout);
router.get('/mis-pedidos', verifyToken, saleController.getMySales);
router.get('/:id', verifyToken, saleController.getSaleById);

// Rutas solo Administrador
router.get('/', verifyToken, requireRole('administrador'), saleController.getAllSales);
router.put('/:id/estado', verifyToken, requireRole('administrador'), saleController.updateSaleStatus);

module.exports = router;