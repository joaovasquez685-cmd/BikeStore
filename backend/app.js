const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// MIDDLEWARES GLOBALES
// ============================================
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging en desarrollo
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} | ${req.method} ${req.originalUrl}`);
    next();
  });
}

// ============================================
// RUTAS
// ============================================
app.get('/', (req, res) => {
  res.json({
    success: true,
    status: 'ok',
    mensaje: 'API RESTful Bike Store v3.0 Funcionando Correctamente',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API funcionando correctamente',
    data: {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    }
  });
});

// Importar rutas
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/products.routes');
const userRoutes = require('./routes/users.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const categoryRoutes = require('./routes/categories.routes');
const orderRoutes = require('./routes/sales.routes');

// Montar rutas
app.use('/api/auth', authRoutes);
app.use('/api/productos', productRoutes);
app.use('/api/usuarios', userRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/categorias', categoryRoutes);
app.use('/api/pedidos', orderRoutes);

// ============================================
// MANEJO DE ERRORES
// ============================================
app.use(notFoundHandler);
app.use(errorHandler);

// ============================================
// INICIAR SERVIDOR
// ============================================
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════╗
║        🚲 BIKE STORE API - BACKEND          ║
╠═══════════════════════════════════════════════╣
║  Servidor corriendo en: http://localhost:${PORT}  ║
║  Environment: ${process.env.NODE_ENV || 'development'}                        ║
╚═══════════════════════════════════════════════╝
  `);
});

module.exports = app;