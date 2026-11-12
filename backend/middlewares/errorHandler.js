// Middleware para manejar errores globalmente
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Error de validación de MySQL (clave duplicada, FK, etc.)
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      success: false,
      message: 'El registro ya existe (clave duplicada)'
    });
  }

  if (err.code === 'ER_NO_REFERENCED_ROW_2' || err.code === 'ER_ROW_IS_REFERENCED_2') {
    return res.status(400).json({
      success: false,
      message: 'Error de integridad referencial'
    });
  }

  // Error de JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Token inválido'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expirado'
    });
  }

  // Error genérico del servidor
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor'
  });
};

// Middleware para rutas no encontradas (404)
const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Ruta ${req.method} ${req.originalUrl} no encontrada`
  });
};

module.exports = { errorHandler, notFoundHandler };