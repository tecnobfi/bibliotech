/**
 * @file categories_repository.js
 * @brief Repositorio para el acceso a datos de las categorías.
 * @project Bibliotech
 * @author Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
 * @license http://www.gnu.org/licenses/gpl.txt GNU GPL 3.0
 * @date Noviembre 2026
 */

const db = require('../config/db');

/**
 * @class CategoriesRepository
 * @brief Gestiona las consultas de categorías mediante Stored Procedures.
 */
class CategoriesRepository
{
    /**
     * @brief Obtiene todas las categorías disponibles.
     * @returns {Promise<Array>} Retorna un array con las categorías.
     */
     async findAll()
     { 
         const [rows] = await db.execute('CALL sp_get_all_categories()'); 
         return rows[0]; 
     }
}

module.exports = new CategoriesRepository();