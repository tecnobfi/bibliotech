/**
 * @file audit_repository.js
 * @brief Capa de acceso a datos para el módulo de trazabilidad y auditoría.
 * @details Implementa el patrón Repository invocando Stored Procedures mediante
 *          consultas preparadas para garantizar integridad y seguridad ante SQLi.
 */

const pool = require('../config/db');

class AuditRepository
{
    /**
     * @brief Registra un evento de auditoría en la base de datos.
     * @details Utiliza parámetros preparados (?) contra sp_create_audit_log
     *          para desacoplar la lógica de negocio del esquema relacional.
     * @param {number|null} userId ID del usuario que ejecuta la acción.
     * @param {string} action Nombre de la acción crítica ('DELETE_BOOK', 'DELETE_USER').
     * @param {string} target Identificador o descripción del recurso afectado.
     * @param {string|null} ipAddress Dirección IP origen de la solicitud.
     * @returns {Promise<void>}
     */
    async createLog(userId, action, target, ipAddress = null)
    {
        await pool.query(
            'CALL sp_create_audit_log(?, ?, ?, ?)',
            [userId, action, String(target), ipAddress]
        );
    }
}

module.exports = new AuditRepository();