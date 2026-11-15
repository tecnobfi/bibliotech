/**
 * @file audit_repository.js
 * @brief Repositorio para la capa de acceso a datos del registro de auditoría (Audit Log).
 * @project Bibliotech
 * @author Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
 * @license http://www.gnu.org/licenses/gpl.txt GNU GPL 3.0
 * @date Noviembre 2026
 */

/**
 * @details Siguiendo el Patrón Repositorio, los controladores nunca hablan directamente
 * con la tabla audit_logs: le piden a este repositorio que guarde o recupere eventos,
 * y el repositorio se encarga de invocar los Procedimientos Almacenados correspondientes.
 * Así, si mañana cambia la forma de persistir los logs, solo se modifica este archivo.
 */
 const db = require('../config/db');

 /**
  * @class AuditRepository
  * @brief Maneja la persistencia y consulta de los eventos de auditoría del sistema.
  */
 class AuditRepository
 {
     /**
      * @brief Registra un nuevo evento de auditoría en la base de datos.
      * @param {number} userId - ID del usuario que ejecuta la acción (el actor).
      * @param {string} action - Código de la acción realizada (ej: 'DELETE_BOOK', 'DELETE_USER').
      * @param {string} target - Recurso afectado por la acción (ej: 'book:15', 'user:3').
      * @param {string|null} ipAddress - IP de origen de la petición (opcional).
      * @returns {Promise<number>} Retorna el ID (Primary Key) del evento insertado.
      *
      * @note Prevención de SQL Injection: db.execute() con el array de parámetros [...]
      * utiliza Prepared Statements, por lo que los valores nunca se concatenan al SQL.
      *
      * @note El valor por defecto null en ipAddress es necesario porque mysql2 no acepta
      * 'undefined' como parámetro de un Prepared Statement; null se traduce a NULL en MySQL.
      */
     async create(userId, action, target, ipAddress = null)
     {
         const [rows] = await db.execute('CALL sp_create_audit_log(?, ?, ?, ?)',
             [userId, action, target, ipAddress]);

         // El Stored Procedure fue diseñado para devolver LAST_INSERT_ID(), igual que sp_create_book
         return rows[0][0].insertId;
     }

     /**
      * @brief Obtiene el historial completo de auditoría, del evento más reciente al más antiguo.
      * @returns {Promise<Array>} Array de eventos con id, user_id, username, action, target, ip_address y created_at.
      *
      * @details Al usar 'CALL', mysql2 devuelve el resultado anidado: rows[0] contiene las filas
      * del SELECT y rows[1] los metadatos de la ejecución del procedimiento.
      *
      * @note username puede llegar como null si el usuario que generó el evento ya fue eliminado
      * (el SP usa LEFT JOIN justamente para no perder esos registros).
      */
     async findAll()
     {
         const [rows] = await db.execute('CALL sp_find_all_audit_logs()');
         return rows[0];
     }
 }

 module.exports = new AuditRepository();
