/**
 * @file audit_repository.js
 * @brief Repositorio para la capa de acceso a datos del registro de auditoría (Accounting).
 * @project Bibliotech
 * @author Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
 * @license http://www.gnu.org/licenses/gpl.txt GNU GPL 3.0
 * @date Octubre 2026
 */

/**
 * @details Siguiendo el Patrón Repositorio, los controladores nunca conocen la tabla
 * 'audit_logs': solo le piden a este módulo que registre un evento.
 */
const db = require('../config/db');

/**
 * @class AuditRepository
 * @brief Persiste eventos de auditoría encapsulando la llamada al Stored Procedure.
 */
class AuditRepository
{
    constructor()
    {
        /**
         * @brief Catálogo cerrado de acciones auditables.
         * @details Objeto congelado para evitar strings "mágicos" repetidos: un error
         * de tipeo (ej: 'DELET_BOOK') rompería silenciosamente las consultas forenses.
         */
        this.ACTIONS = Object.freeze({
            DELETE_BOOK: 'DELETE_BOOK',
            DELETE_USER: 'DELETE_USER'
        });
    }

    /**
     * @brief Registra un evento de auditoría en la base de datos.
     * @param {Object} auditData - DTO con los datos del evento.
     * @param {number} auditData.user_id - Id del usuario que ejecutó la acción (actor).
     * @param {string} auditData.action - Acción realizada (usar this.ACTIONS).
     * @param {string} auditData.target - Recurso afectado (ej: 'book:12').
     * @param {string} [auditData.ip_address] - IP de origen (opcional).
     * @returns {Promise<number>} ID del registro de auditoría creado.
     *
     * @note Prevención de SQL Injection: db.execute() con parámetros '?' sobre un
     * Stored Procedure; nunca se concatenan strings.
     * @note mysql2 lanza error con 'undefined', por eso la IP opcional se normaliza a null.
     */
    async create(auditData)
    {
        const { user_id, action, target, ip_address } = auditData;
        const [rows] = await db.execute('CALL sp_create_audit_log(?, ?, ?, ?)',
            [user_id, action, target, ip_address || null]);

        return rows[0][0].insertId;
    }
}

module.exports = new AuditRepository();