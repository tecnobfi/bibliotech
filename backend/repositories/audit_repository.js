/**
 * @file audit_repository.js
 * @brief Repositorio para la persistencia de registros de auditoría.
 * @project Bibliotech
 * @author Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
 * @license http://www.gnu.org/licenses/gpl.txt GNU GPL 3.0
 * @date Noviembre 2026
 */

const db = require('../config/db');

/**
 * @class AuditRepository
 * @brief Encapsula el acceso a los registros de auditoría mediante Stored Procedures.
 */
class AuditRepository
{
    /**
     * @brief Persiste un evento de auditoría en la base de datos.
     * @param {Object} logData - Datos del evento de auditoría.
     * @returns {Promise<boolean>} Indica si el registro se insertó correctamente.
     */
    async create(logData)
    {
        const { user_id, action, target, ip_address = null } = logData;

        await db.execute(
            'CALL sp_create_audit_log(?, ?, ?, ?)',
            [user_id, action, String(target), ip_address]
        );

        return true;
    }
}

module.exports = new AuditRepository();
