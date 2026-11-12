const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ============================================
// REGISTRO DE USUARIO
// ============================================
exports.register = async (req, res) => {
  const { nombre, correo, clave } = req.body;

  if (!nombre || !correo || !clave) {
    return res.status(400).json({
      success: false,
      message: 'Por favor complete todos los campos obligatorios.'
    });
  }

  try {
    // Verificar si el correo ya existe
    const [exist] = await pool.query(
      'SELECT id_usuario FROM USUARIOS WHERE correo = ?',
      [correo]
    );
    if (exist.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'El correo electrónico ya se encuentra registrado.'
      });
    }

    // Encriptar clave con bcrypt
    const saltRounds = 10;
    const clave_hash = await bcrypt.hash(clave, saltRounds);

    // Insertar usuario (rol por defecto: 'cliente')
    const [result] = await pool.query(
      'INSERT INTO USUARIOS (nombre, correo, clave_hash, rol) VALUES (?, ?, ?, \'cliente\')',
      [nombre, correo, clave_hash]
    );

    // Generar token JWT
    const token = jwt.sign(
      {
        id_usuario: result.insertId,
        nombre,
        correo,
        rol: 'cliente'
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente.',
      data: {
        usuario: {
          id_usuario: result.insertId,
          nombre,
          correo,
          rol: 'cliente'
        },
        token
      }
    });
  } catch (error) {
    console.error('Error en register:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor al registrar usuario.'
    });
  }
};

// ============================================
// LOGIN DE USUARIO
// ============================================
exports.login = async (req, res) => {
  const { correo, clave } = req.body;

  if (!correo || !clave) {
    return res.status(400).json({
      success: false,
      message: 'Ingrese correo y contraseña.'
    });
  }

  try {
    // Buscar usuario por correo
    const [rows] = await pool.query(
      'SELECT id_usuario, nombre, correo, clave_hash, rol, activo FROM USUARIOS WHERE correo = ?',
      [correo]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas.'
      });
    }

    const usuario = rows[0];

    // Verificar si el usuario está activo
    if (!usuario.activo) {
      return res.status(403).json({
        success: false,
        message: 'Esta cuenta se encuentra desactivada.'
      });
    }

    // Comparar contraseña
    const match = await bcrypt.compare(clave, usuario.clave_hash);
    if (!match) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas.'
      });
    }

    // Generar token JWT
    const token = jwt.sign(
      {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Respuesta sin clave_hash
    res.json({
      success: true,
      message: 'Inicio de sesión exitoso.',
      data: {
        token,
        usuario: {
          id_usuario: usuario.id_usuario,
          nombre: usuario.nombre,
          correo: usuario.correo,
          rol: usuario.rol
        }
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error al iniciar sesión.'
    });
  }
};

// ============================================
// OBTENER PERFIL DEL USUARIO
// ============================================
exports.perfil = async (req, res) => {
  const { id_usuario } = req.user;

  try {
    const [rows] = await pool.query(
      'SELECT id_usuario, nombre, correo, rol, activo, fecha_registro FROM USUARIOS WHERE id_usuario = ?',
      [id_usuario]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado.'
      });
    }

    res.json({
      success: true,
      message: 'Perfil obtenido correctamente.',
      data: { usuario: rows[0] }
    });
  } catch (error) {
    console.error('Error en perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el perfil.'
    });
  }
};

// ============================================
// RECUPERAR CONTRASEÑA
// ============================================
exports.recoverPassword = async (req, res) => {
  const { correo } = req.body;

  if (!correo) {
    return res.status(400).json({
      success: false,
      message: 'Ingrese su correo registrado.'
    });
  }

  try {
    const [rows] = await pool.query(
      'SELECT id_usuario, nombre FROM USUARIOS WHERE correo = ?',
      [correo]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No existe una cuenta registrada con ese correo.'
      });
    }

    // Generar clave temporal
    const claveTemporal = 'Bike' + Math.floor(1000 + Math.random() * 9000) + '!';
    const clave_hash = await bcrypt.hash(claveTemporal, 10);

    await pool.query(
      'UPDATE USUARIOS SET clave_hash = ? WHERE correo = ?',
      [clave_hash, correo]
    );

    console.log(`[SIMULACIÓN EMAIL] Enviado a ${correo}: Tu contraseña temporal es ${claveTemporal}`);

    res.json({
      success: true,
      message: 'Se ha generado una contraseña temporal. Por favor revise su correo e inicie sesión.',
      data: { clave_temporal_simulada: claveTemporal }
    });
  } catch (error) {
    console.error('Error en recoverPassword:', error);
    res.status(500).json({
      success: false,
      message: 'Error al procesar la recuperación de contraseña.'
    });
  }
};