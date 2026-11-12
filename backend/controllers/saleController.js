const pool = require('../config/db');

// ============================================
// PROCESAR CHECKOUT CON TRANSIÓN ATÓMICA
// ============================================
exports.processCheckout = async (req, res) => {
  const id_usuario = req.user.id_usuario;
  const { items, direccion_envio } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'El carrito no contiene ítems.'
    });
  }

  if (!direccion_envio) {
    return res.status(400).json({
      success: false,
      message: 'Falta la dirección de envío.'
    });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    let subtotal = 0;
    const itemsWithDetails = [];

    // 1. Verificar stock y detalles de productos
    for (const item of items) {
      const { id_producto, cantidad } = item;

      const [prodRows] = await connection.query(
        `SELECT id_producto, nombre, precio, descuento_pct, stock
         FROM PRODUCTOS WHERE id_producto = ? AND activo = TRUE FOR UPDATE`,
        [id_producto]
      );

      if (prodRows.length === 0) {
        throw new Error(`El producto con ID ${id_producto} no existe o no está activo.`);
      }

      const producto = prodRows[0];

      if (producto.stock < cantidad) {
        throw new Error(`Stock insuficiente para "${producto.nombre}". Disponible: ${producto.stock}, Solicitado: ${cantidad}`);
      }

      const precioConDescuento = Number(producto.precio) * (1 - Number(producto.descuento_pct) / 100);
      const itemSubtotal = precioConDescuento * cantidad;

      subtotal += itemSubtotal;

      itemsWithDetails.push({
        id_producto,
        nombre_copia: producto.nombre,
        precio_unitario: precioConDescuento,
        cantidad,
        subtotal: itemSubtotal
      });
    }

    // 2. Calcular envío (gratis si subtotal >= 2,000,000)
    const ENVIO_GRATIS_DESDE = 2000000;
    const COSTO_ENVIO = 20000;
    const envio = subtotal >= ENVIO_GRATIS_DESDE ? 0 : COSTO_ENVIO;
    const precioTotal = subtotal + envio;

    // 3. Generar número de pedido único
    const fecha = new Date();
    const fechaStr = fecha.toISOString().slice(0, 10).replace(/-/g, '');
    const randomPart = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const numeroPedido = `PED-${fechaStr}-${randomPart}`;

    // 4. Insertar cabecera en PEDIDOS
    const [pedidoResult] = await connection.query(
      `INSERT INTO PEDIDOS
       (id_usuario, numero, estado, subtotal, envio, precio_total, direccion_envio)
       VALUES (?, ?, 'pagado', ?, ?, ?, ?)`,
      [id_usuario, numeroPedido, subtotal, envio, precioTotal, direccion_envio]
    );

    const id_pedido = pedidoResult.insertId;

    // 5. Insertar detalles y actualizar stock
    for (const item of itemsWithDetails) {
      await connection.query(
        `INSERT INTO DETALLE_PEDIDOS
         (id_pedido, id_producto, nombre_producto_copia, precio_unitario, cantidad, subtotal)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [id_pedido, item.id_producto, item.nombre_copia, item.precio_unitario, item.cantidad, item.subtotal]
      );

      await connection.query(
        'UPDATE PRODUCTOS SET stock = stock - ? WHERE id_producto = ?',
        [item.cantidad, item.id_producto]
      );
    }

    // 6. Registrar pago simulado
    const referenciaPago = 'PAY-' + Date.now() + '-' + Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    await connection.query(
      `INSERT INTO PAGOS (id_pedido, metodo, estado, referencia)
       VALUES (?, 'tarjeta_credito', 'aprobado', ?)`,
      [id_pedido, referenciaPago]
    );

    await connection.commit();

    // 7. Obtener pedido completo
    const [pedidoRows] = await connection.query(
      `SELECT * FROM PEDIDOS WHERE id_pedido = ?`,
      [id_pedido]
    );

    const [detalleRows] = await connection.query(
      `SELECT * FROM DETALLE_PEDIDOS WHERE id_pedido = ?`,
      [id_pedido]
    );

    res.status(201).json({
      success: true,
      message: '¡Venta procesada exitosamente!',
      data: {
        pedido: pedidoRows[0],
        detalles: detalleRows,
        pago: {
          referencia: referenciaPago,
          estado: 'aprobado'
        }
      }
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error en processCheckout:', error.message);
    res.status(400).json({
      success: false,
      message: error.message || 'Error al procesar la compra.'
    });
  } finally {
    connection.release();
  }
};

// ============================================
// MIS PEDIDOS (CLIENTE)
// ============================================
exports.getMySales = async (req, res) => {
  const id_usuario = req.user.id_usuario;

  try {
    const [sales] = await pool.query(
      `SELECT p.id_pedido, p.numero, p.fecha, p.estado, p.subtotal, p.envio, p.precio_total,
              pg.referencia AS referencia_pago
       FROM PEDIDOS p
       LEFT JOIN PAGOS pg ON p.id_pedido = pg.id_pedido
       WHERE p.id_usuario = ?
       ORDER BY p.fecha DESC`,
      [id_usuario]
    );

    // Agregar detalles a cada pedido
    for (const sale of sales) {
      const [detalles] = await pool.query(
        `SELECT * FROM DETALLE_PEDIDOS WHERE id_pedido = ?`,
        [sale.id_pedido]
      );
      sale.detalles = detalles;
    }

    res.json({
      success: true,
      message: 'Pedidos obtenidos correctamente',
      data: { pedidos: sales }
    });
  } catch (error) {
    console.error('Error en getMySales:', error);
    res.status(500).json({
      success: false,
      message: 'Error al consultar historial de pedidos.'
    });
  }
};

// ============================================
// OBTENER PEDIDO POR ID
// ============================================
exports.getSaleById = async (req, res) => {
  const { id } = req.params;
  const { id_usuario, rol } = req.user;

  try {
    let query = `
      SELECT p.id_pedido, p.id_usuario, p.numero, p.fecha, p.estado,
             p.subtotal, p.envio, p.precio_total, p.direccion_envio,
             u.nombre AS cliente_nombre, u.correo AS cliente_correo
      FROM PEDIDOS p
      INNER JOIN USUARIOS u ON p.id_usuario = u.id_usuario
      WHERE p.id_pedido = ?
    `;
    const params = [id];

    // Si es cliente, solo puede ver sus propios pedidos
    if (rol === 'cliente') {
      query += ' AND p.id_usuario = ?';
      params.push(id_usuario);
    }

    const [sales] = await pool.query(query, params);

    if (sales.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Pedido no encontrado.'
      });
    }

    const pedido = sales[0];

    // Obtener detalles
    const [detalles] = await pool.query(
      `SELECT * FROM DETALLE_PEDIDOS WHERE id_pedido = ?`,
      [id]
    );

    // Obtener pago
    const [pagos] = await pool.query(
      `SELECT id_pago, metodo, estado, fecha, referencia FROM PAGOS WHERE id_pedido = ?`,
      [id]
    );

    pedido.detalles = detalles;
    pedido.pago = pagos[0] || null;

    res.json({
      success: true,
      message: 'Pedido obtenido correctamente.',
      data: { pedido }
    });
  } catch (error) {
    console.error('Error en getSaleById:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el pedido.'
    });
  }
};

// ============================================
// LISTAR TODOS LOS PEDIDOS (ADMIN)
// ============================================
exports.getAllSales = async (req, res) => {
  try {
    const { estado, page = 1, limit = 20 } = req.query;

    let whereClause = '';
    const params = [];

    if (estado) {
      whereClause = 'WHERE p.estado = ?';
      params.push(estado);
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const offset = (pageNum - 1) * limitNum;

    const [sales] = await pool.query(
      `SELECT p.id_pedido, p.numero, p.fecha, p.estado, p.subtotal, p.envio, p.precio_total,
              u.nombre AS cliente_nombre, u.correo AS cliente_correo
       FROM PEDIDOS p
       INNER JOIN USUARIOS u ON p.id_usuario = u.id_usuario
       ${whereClause}
       ORDER BY p.fecha DESC
       LIMIT ? OFFSET ?`,
      [...params, limitNum, offset]
    );

    // Total para paginación
    const [countResult] = await pool.query(
      `SELECT COUNT(*) as total FROM PEDIDOS p ${whereClause}`,
      params
    );

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limitNum);

    // Agregar detalles a cada pedido
    for (const sale of sales) {
      const [detalles] = await pool.query(
        `SELECT * FROM DETALLE_PEDIDOS WHERE id_pedido = ?`,
        [sale.id_pedido]
      );
      sale.detalles = detalles;
    }

    res.json({
      success: true,
      message: 'Pedidos obtenidos correctamente',
      data: {
        pedidos: sales,
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
    console.error('Error en getAllSales:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener pedidos.'
    });
  }
};

// ============================================
// ACTUALIZAR ESTADO DE PEDIDO (ADMIN)
// ============================================
exports.updateSaleStatus = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  const estadosValidos = ['pendiente', 'pagado', 'enviado', 'entregado', 'cancelado'];
  if (!estadosValidos.includes(estado)) {
    return res.status(400).json({
      success: false,
      message: `Estado inválido. Valores permitidos: ${estadosValidos.join(', ')}`
    });
  }

  try {
    const [result] = await pool.query(
      'SELECT id_pedido FROM PEDIDOS WHERE id_pedido = ?',
      [id]
    );

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Pedido no encontrado.'
      });
    }

    await pool.query(
      'UPDATE PEDIDOS SET estado = ? WHERE id_pedido = ?',
      [estado, id]
    );

    // Si se cancela, restaurar stock
    if (estado === 'cancelado') {
      const [detalles] = await pool.query(
        'SELECT id_producto, cantidad FROM DETALLE_PEDIDOS WHERE id_pedido = ?',
        [id]
      );

      for (const item of detalles) {
        await pool.query(
          'UPDATE PRODUCTOS SET stock = stock + ? WHERE id_producto = ?',
          [item.cantidad, item.id_producto]
        );
      }
    }

    res.json({
      success: true,
      message: `Estado del pedido actualizado a ${estado}`
    });
  } catch (error) {
    console.error('Error en updateSaleStatus:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el estado.'
    });
  }
};