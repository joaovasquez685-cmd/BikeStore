const mysql = require('mysql2/promise'); // Importa el cliente MySQL con soporte para promesas.
require('dotenv').config(); // Carga las variables de entorno desde el archivo .env.

const pool = mysql.createPool({ // Crea un pool para reutilizar conexiones a la base de datos.
  host: process.env.DB_HOST || 'localhost', // Usa el host configurado o localhost por defecto.
  user: process.env.DB_USER || 'root', // Usa el usuario configurado o root por defecto.
  password: process.env.DB_PASSWORD || '', // Usa la contraseña configurada o una cadena vacía por defecto.
  database: process.env.DB_NAME || 'bikestore', // Usa la base configurada o bikestore por defecto.
  port: process.env.DB_PORT || 3306, // Usa el puerto configurado o el puerto MySQL predeterminado.
  waitForConnections: true, // Espera si todas las conexiones disponibles están ocupadas.
  connectionLimit: 10, // Limita el pool a un máximo de diez conexiones simultáneas.
  queueLimit: 0 // Permite que las solicitudes esperen en una cola sin límite definido.
}); // Finaliza la configuración del pool.

// Verificación inicial de conexión.
pool.getConnection() // Solicita una conexión para comprobar el acceso a MySQL.
  .then(conn => { // Ejecuta esta función si se obtiene una conexión correctamente.
    console.log('✅ Conexión exitosa a la base de datos MySQL (bikestore)'); // Informa que la conexión inicial fue exitosa.
    conn.release(); // Libera la conexión para que vuelva a estar disponible en el pool.
  }) // Finaliza la función de conexión exitosa.
  .catch(err => { // Ejecuta esta función si ocurre un error al conectarse.
    console.error('❌ Error al conectar con MySQL:', err.message); // Informa el motivo del error de conexión.
  }); // Finaliza el manejo de la conexión inicial.

module.exports = pool; // Exporta el pool para usarlo en el resto del backend.
