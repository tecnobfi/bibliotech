/**
 * @file db.js
 * @brief Configuración y exportación del Pool de conexiones a MySQL.
 * @project Bibliotech
 * @author Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
 * @license http://www.gnu.org/licenses/gpl.txt GNU GPL 3.0
 * @date Octubre 2026
 */

/**
 * @details El driver mysql2 proporciona una API nativa para Node.js que soporta promesas (async/await)
 * y Prepared Statements, lo cual es fundamental para prevenir ataques de SQL Injection.
 */
 const mysql = require('mysql2');

 /**
  * @brief Creación del Pool de Conexiones.
  * @details A diferencia de `mysql.createConnection()` que abre y cierra una única conexión TCP 
  * (lo cual genera un alto costo de rendimiento por el Handshake de red), un `Pool` mantiene 
  * múltiples conexiones abiertas en memoria listas para ser reutilizadas por peticiones concurrentes.
  * 
  * @note Seguridad: Nunca se deben exponer credenciales en texto plano en el código fuente. 
  * Siempre se inyectan en tiempo de ejecución mediante variables de entorno (process.env).
  */
 const pool = mysql.createPool({
     host: process.env.DB_HOST,
     user: process.env.DB_USER,
     password: process.env.DB_PASS,
     database: process.env.DB_NAME,
     waitForConnections: true,
     connectionLimit: 10, // Máximo de conexiones simultáneas permitidas
     queueLimit: 0
 });
 
 // Exportamos la promesa del pool para poder utilizar async/await en la capa de Repositorios
 module.exports = pool.promise();