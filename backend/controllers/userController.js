const pool = require('../config/db');

// ============================================
// LISTAR USUARIOS (ADMIN)
// ============================================
exports.getAllUsers = async (req, res) => {
  try {
    const { rol, activo, busqueda } = req.query;

    let whereClause = 'WHERE 1=1';
    const params = [];

    if (rol) {
      whereClause += ' AND rol = ?';
      params.push(rol);
    }

    if (activo !== undefined) {
      whereClause += ' AND activo = ?';
      params.push(activo === 'true');
    }

    if (busqueda) {
      whereClause += ' AND (nombre LIKE ? OR correo LIKE ?)';
      params.push(`%${busqueda}%`, `%${busqueda}%`);
    }

    const [users] = await pool.query(
      `SELECT id_usuario, nombre, correo, rol, activo, fecha_registro
       FROM USUARIOS ${whereClause}
       ORDER BY fecha_registro DESC`,
      params
    );

    res.json({
      success: true,
      message: 'Usuarios obtenidos correctamente',
      data: { usuarios: users }
    });
  } catch (error) {
    console.error('Error en getAllUsers:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuarios.'
    });
  }
};

// ============================================
// TOGGLER ESTADO USUARIO (ADMIN)
// ============================================
exports.toggleUserStatus = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query(
      'SELECT id_usuario, rol FROM USUARIOS WHERE id_usuario = ?',
      [id]
    );

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado.'
      });
    }

    // No permitir desactivar a uno mismo
    if (req.user.id_usuario === parseInt(id)) {
      return res.status(400).json({
        success: false,
        message: 'No puedes desactivar tu propia cuenta.'
      });
    }

    await pool.query(
      'UPDATE USUARIOS SET activo = NOT activo WHERE id_usuario = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Estado del usuario modificado correctamente.'
    });
  } catch (error) {
    console.error('Error en toggleUserStatus:', error);
    res.status(500).json({
      success: false,
      message: 'Error al modificar usuario.'
    });
  }
};