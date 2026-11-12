const pool = require('../config/db');

// ============================================
// TOP 5 PRODUCTOS MÁS VENDIDOS
// ============================================
exports.getTopSellingProducts = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        p.id_producto,
        p.nombre,
        SUM(dv.cantidad) AS total_unidades_vendidas,
        SUM(dv.subtotal) AS ingresos_generados
      FROM DETALLE_PEDIDOS dv
      INNER JOIN PRODUCTOS p ON dv.id_producto = p.id_producto
      INNER JOIN PEDIDOS per ON dv.id_pedido = per.id_pedido
      WHERE per.estado IN ('pagado', 'enviado', 'entregado')
      GROUP BY p.id_producto, p.nombre
      ORDER BY total_unidades_vendidas DESC
      LIMIT 5
    `);

    res.json({
      success: true,
      message: 'Productos más vendidos obtenidos correctamente',
      data: { productos: rows }
    });
  } catch (error) {
    console.error('Error en getTopSellingProducts:', error);
    res.status(500).json({
      success: false,
      message: 'Error al calcular los productos más vendidos.'
    });
  }
};

// ============================================
// RESUMEN DE VENTAS
// ============================================
exports.getSalesSummary = async (req, res) => {
  const { fecha_inicio, fecha_fin } = req.query;

  try {
    let sql = `
      SELECT
        COUNT(id_pedido) AS total_pedidos,
        COALESCE(SUM(precio_total), 0) AS total_ingresos
      FROM PEDIDOS
      WHERE estado IN ('pagado', 'enviado', 'entregado')
    `;
    const params = [];

    if (fecha_inicio && fecha_fin) {
      sql += ' AND fecha BETWEEN ? AND ?';
      params.push(fecha_inicio, fecha_fin);
    }

    const [summary] = await pool.query(sql, params);

    res.json({
      success: true,
      message: 'Resumen de ventas obtenido correctamente',
      data: summary[0]
    });
  } catch (error) {
    console.error('Error en getSalesSummary:', error);
    res.status(500).json({
      success: false,
      message: 'Error al generar resumen de ventas.'
    });
  }
};