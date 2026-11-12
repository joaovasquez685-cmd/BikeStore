const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { verifyToken, requireRole } = require('../middlewares/authMiddleware');

// Todas las rutas requieren rol administrador
router.use(verifyToken, requireRole('administrador'));

router.get('/top-selling', dashboardController.getTopSellingProducts);
router.get('/summary', dashboardController.getSalesSummary);

module.exports = router;