const pool = require('../config/db');

exports.listarProductos = async (req, res) => {
  try {
    const { categoria, tipo, busqueda, orden = 'asc', page = 1, limit = 10 } = req.query;

    let whereClause = 'WHERE p.activo = TRUE';
    const params = [];

    if (categoria) {
      whereClause += ' AND p.id_categoria = ?';
      params.push(categoria);
    }

    if (tipo) {
      whereClause += ' AND p.tipo = ?';
      params.push(tipo);
    }

    if (busqueda) {
      whereClause += ' AND p.nombre LIKE ?';
      params.push(`%${busqueda}%`);
    }

    const ordenValido = ['asc', 'desc'].includes(orden.toLowerCase()) ? orden.toUpperCase() : 'ASC';

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const offset = (pageNum - 1) * limitNum;

    const query = `
      SELECT 
        p.id_producto,
        p.id_categoria,
        c.nombre AS categoria_nombre,
        c.slug AS categoria_slug,
        p.nombre,
        p.tipo,
        p.precio,
        p.descuento_pct,
        p.stock,
        p.imagen,
        p.fecha_creacion,
        ROUND(p.precio * (1 - p.descuento_pct / 100), 2) AS precio_final
      FROM PRODUCTOS p
      JOIN CATEGORIAS c ON p.id_categoria = c.id_categoria
      ${whereClause}
      ORDER BY p.precio ${ordenValido}
      LIMIT ? OFFSET ?
    `;

    params.push(limitNum, offset);
    const [productos] = await pool.execute(query, params);

    const countQuery = `
      SELECT COUNT(*) as total
      FROM PRODUCTOS p
      JOIN CATEGORIAS c ON p.id_categoria = c.id_categoria
      ${whereClause}
    `;
    const [countResult] = await pool.execute(countQuery, params.slice(0, -2));
    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      message: 'Productos obtenidos correctamente',
      data: {
        productos,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages,
          hasNext: pageNum < totalPages,
          hasPrev: pageNum > 1
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.obtenerProducto = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.execute(
      `SELECT 
        p.id_producto,
        p.id_categoria,
        c.nombre AS categoria_nombre,
        c.slug AS categoria_slug,
        p.nombre,
        p.tipo,
        p.precio,
        p.descuento_pct,
        p.stock,
        p.imagen,
        p.fecha_creacion,
        ROUND(p.precio * (1 - p.descuento_pct / 100), 2) AS precio_final
      FROM PRODUCTOS p
      JOIN CATEGORIAS c ON p.id_categoria = c.id_categoria
      WHERE p.id_producto = ? AND p.activo = TRUE`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Producto obtenido correctamente',
      data: { producto: rows[0] }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.crearProducto = async (req, res) => {
  try {
    const { id_categoria, nombre, tipo, precio, descuento_pct = 0, stock = 0, imagen } = req.body;

    if (!id_categoria || !nombre || !tipo || precio === undefined) {
      return res.status(400).json({
        success: false,
        message: 'id_categoria, nombre, tipo y precio son obligatorios'
      });
    }

    if (!['bicicleta', 'accesorio', 'repuesto'].includes(tipo)) {
      return res.status(400).json({
        success: false,
        message: 'Tipo debe ser: bicicleta, accesorio o repuesto'
      });
    }

    if (precio < 0 || descuento_pct < 0 || descuento_pct > 100 || stock < 0) {
      return res.status(400).json({
        success: false,
        message: 'Valores inválidos: precio >= 0, descuento 0-100, stock >= 0'
      });
    }

    const [cat] = await pool.execute(
      'SELECT id_categoria FROM CATEGORIAS WHERE id_categoria = ? AND activo = TRUE',
      [id_categoria]
    );

    if (cat.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Categoría no encontrada o inactiva'
      });
    }

    const [result] = await pool.execute(
      `INSERT INTO PRODUCTOS (id_categoria, nombre, tipo, precio, descuento_pct, stock, imagen) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id_categoria, nombre, tipo, precio, descuento_pct, stock, imagen || null]
    );

    const [nuevoProducto] = await pool.execute(
      `SELECT 
        p.id_producto,
        p.id_categoria,
        c.nombre AS categoria_nombre,
        p.nombre,
        p.tipo,
        p.precio,
        p.descuento_pct,
        p.stock,
        p.imagen,
        p.fecha_creacion,
        ROUND(p.precio * (1 - p.descuento_pct / 100), 2) AS precio_final
      FROM PRODUCTOS p
      JOIN CATEGORIAS c ON p.id_categoria = c.id_categoria
      WHERE p.id_producto = ?`,
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Producto creado correctamente',
      data: { producto: nuevoProducto[0] }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_categoria, nombre, tipo, precio, descuento_pct, stock, imagen, activo } = req.body;

    const [existing] = await pool.execute(
      'SELECT id_producto FROM PRODUCTOS WHERE id_producto = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    const updates = [];
    const params = [];

    if (id_categoria !== undefined) {
      const [cat] = await pool.execute(
        'SELECT id_categoria FROM CATEGORIAS WHERE id_categoria = ? AND activo = TRUE',
        [id_categoria]
      );
      if (cat.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Categoría no encontrada o inactiva'
        });
      }
      updates.push('id_categoria = ?');
      params.push(id_categoria);
    }

    if (nombre !== undefined) {
      updates.push('nombre = ?');
      params.push(nombre);
    }

    if (tipo !== undefined) {
      if (!['bicicleta', 'accesorio', 'repuesto'].includes(tipo)) {
        return res.status(400).json({
          success: false,
          message: 'Tipo debe ser: bicicleta, accesorio o repuesto'
        });
      }
      updates.push('tipo = ?');
      params.push(tipo);
    }

    if (precio !== undefined) {
      if (precio < 0) {
        return res.status(400).json({
          success: false,
          message: 'El precio debe ser >= 0'
        });
      }
      updates.push('precio = ?');
      params.push(precio);
    }

    if (descuento_pct !== undefined) {
      if (descuento_pct < 0 || descuento_pct > 100) {
        return res.status(400).json({
          success: false,
          message: 'El descuento debe estar entre 0 y 100'
        });
      }
      updates.push('descuento_pct = ?');
      params.push(descuento_pct);
    }

    if (stock !== undefined) {
      if (stock < 0) {
        return res.status(400).json({
          success: false,
          message: 'El stock debe ser >= 0'
        });
      }
      updates.push('stock = ?');
      params.push(stock);
    }

    if (imagen !== undefined) {
      updates.push('imagen = ?');
      params.push(imagen);
    }

    if (activo !== undefined) {
      updates.push('activo = ?');
      params.push(activo);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No hay campos para actualizar'
      });
    }

    params.push(id);
    await pool.execute(
      `UPDATE PRODUCTOS SET ${updates.join(', ')} WHERE id_producto = ?`,
      params
    );

    const [actualizado] = await pool.execute(
      `SELECT 
        p.id_producto,
        p.id_categoria,
        c.nombre AS categoria_nombre,
        p.nombre,
        p.tipo,
        p.precio,
        p.descuento_pct,
        p.stock,
        p.imagen,
        p.activo,
        p.fecha_creacion,
        ROUND(p.precio * (1 - p.descuento_pct / 100), 2) AS precio_final
      FROM PRODUCTOS p
      JOIN CATEGORIAS c ON p.id_categoria = c.id_categoria
      WHERE p.id_producto = ?`,
      [id]
    );

    res.json({
      success: true,
      message: 'Producto actualizado correctamente',
      data: { producto: actualizado[0] }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await pool.execute(
      'SELECT id_producto FROM PRODUCTOS WHERE id_producto = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    await pool.execute(
      'UPDATE PRODUCTOS SET activo = FALSE WHERE id_producto = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Producto desactivado correctamente (borrado lógico)',
      data: { id_producto: parseInt(id) }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.listarCategorias = async (req, res) => {
  try {
    const [categorias] = await pool.execute(
      'SELECT id_categoria, nombre, slug, descripcion FROM CATEGORIAS WHERE activo = TRUE ORDER BY nombre'
    );

    res.json({
      success: true,
      message: 'Categorías obtenidas correctamente',
      data: { categorias }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};