
/**
 * @file audit_repository.js
 * @brief Repositorio encargado de guardar los registros de auditoría.
 */

const db = require('../config/db');

class AuditRepository
{
    /**
     * @brief Guarda en la base de datos las acciones realizadas por los usuarios.
     * @param {Object} auditData - Datos de la accion que se quiere registrar.
     * @param {number} auditData.user_id 
     * @param {string} auditData.action .
    * @param {string} auditData.target - ID del libro o usuario afectado.
    * @param {string|null} auditData.ip_address - IP del usuario, o null si no está disponible.
     * @returns {Promise<boolean>} Devuelve true si el guardado se pudo realizar correctamente.
     */
    async create({ user_id, action, target, ip_address = null })
    {  // Llamamos al procedimiento almacenado para guardar el registro.
        await db.execute(
            'CALL sp_create_audit_log(?, ?, ?, ?)',
            [user_id, action, target, ip_address]
        );
        return true;
    }
}

module.exports = new AuditRepository();
