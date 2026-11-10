/**
*@file audit_repository.js
*@brief Repositorio para la capa de acceso a datos de los registros de auditoría.
*@project Bibliotech
*@author Tecnologías Informáticas B - Facultad de Ingeniería - UNMDP
*@license http://www.gnu.org/licenses/gpl.txt GNU GPL 3.0
*@date Noviembre 2026
*/

const db = require('../config/db');

/**
 * @class AuditRepository
 * @brief Registra una acción realizada dentro del sistema.
 * @param {number|null} userId - Identificador del usuario que realizó la acción.
 * @param {string} action - Acción realizada.
 * @param {string} target - Elemento sobre el cual se realizó la acción.
 * @param {string|null} ipAddress - Dirección IP desde donde se realizó la acción.
 * @returns {Promise<boolean>} Retorna true si el registro se guardó correctamente.
 */

class AuditRepository 
{
     async create(userId, action, target, ipAddress = null)
    {
    await db.execute(
        'CALL sp_create_audit_log(?, ?, ?, ?)', [userId, action, target, ipAddress]);
        return true;
    }
}

module.exports = new AuditRepository(); 
