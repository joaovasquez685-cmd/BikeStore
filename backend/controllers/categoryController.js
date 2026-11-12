const pool = require('../config/db');

// ============================================
// LISTAR CATEGORÍAS
// ============================================
exports.getCategories = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id_categoria, nombre, slug, descripcion FROM CATEGORIAS WHERE activo = TRUE'
    );
    res.json({
      success: true,
      message: 'Categorías obtenidas correctamente',
      data: { categorias: rows }
    });
  } catch (error) {
    console.error('Error en getCategories:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener categorías.'
    });
  }
};

// ============================================
// CREAR CATEGORÍA
// ============================================
exports.createCategory = async (req, res) => {
  const { nombre, slug, descripcion } = req.body;

  if (!nombre) {
    return res.status(400).json({
      success: false,
      message: 'El nombre de la categoría es obligatorio.'
    });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO CATEGORIAS (nombre, slug, descripcion) VALUES (?, ?, ?)',
      [nombre, slug || nombre.toLowerCase().replace(/\s+/g, '-'), descripcion || '']
    );

    res.status(201).json({
      success: true,
      message: 'Categoría creada correctamente',
      data: { id_categoria: result.insertId }
    });
  } catch (error) {
    console.error('Error en createCategory:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear categoría.'
    });
  }
};

// ============================================
// ACTUALIZAR CATEGORÍA
// ============================================
exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { nombre, slug, descripcion, activo } = req.body;

  try {
    const updates = [];
    const params = [];

    if (nombre !== undefined) {
      updates.push('nombre = ?');
      params.push(nombre);
    }

    if (slug !== undefined) {
      updates.push('slug = ?');
      params.push(slug);
    }

    if (descripcion !== undefined) {
      updates.push('descripcion = ?');
      params.push(descripcion);
    }

    if (activo !== undefined) {
      updates.push('activo = ?');
      params.push(activo);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No hay campos para actualizar.'
      });
    }

    params.push(id);

    await pool.query(
      `UPDATE CATEGORIAS SET ${updates.join(', ')} WHERE id_categoria = ?`,
      params
    );

    const [updated] = await pool.query(
      'SELECT id_categoria, nombre, slug, descripcion, activo FROM CATEGORIAS WHERE id_categoria = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Categoría actualizada correctamente',
      data: { categoria: updated[0] }
    });
  } catch (error) {
    console.error('Error en updateCategory:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar categoría.'
    });
  }
};

// ============================================
// ELIMINAR CATEGORÍA
// ============================================
exports.deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query(
      'SELECT id_categoria FROM CATEGORIAS WHERE id_categoria = ?',
      [id]
    );

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada.'
      });
    }

    await pool.query(
      'UPDATE CATEGORIAS SET activo = FALSE WHERE id_categoria = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Categoría desactivada correctamente',
      data: { id_categoria: parseInt(id) }
    });
  } catch (error) {
    console.error('Error en deleteCategory:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar categoría.'
    });
  }
};