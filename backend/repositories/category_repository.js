/**
 * @file category_repository.js
 * @brief Repositorio para la capa de acceso a datos de categorías de libros.
 * @project Bibliotech
 * @author Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
 * @license http://www.gnu.org/licenses/gpl.txt GNU GPL 3.0
 * @date Noviembre 2026
 */

const db = require('../config/db');

/**
 * @class CategoryRepository
 * @brief Maneja las operaciones sobre la entidad category encapsulando llamadas a Stored Procedures.
 */
class CategoryRepository 
{
    /**
     * @brief Obtiene el listado completo de categorías registradas en la base de datos.
     * @returns {Promise<Array>} Retorna un array con todas las categorías disponibles.
     */
    async findAll() 
    {
        const [rows] = await db.execute('CALL sp_find_all_categories()');
        return rows[0];
    }

    /**
     * @brief Persiste una nueva categoría en la base de datos.
     * @param {string} name - Nombre único de la categoría.
     * @returns {Promise<number>} Retorna el ID asignado a la nueva categoría.
     */
    async create(name) 
    {
        const [rows] = await db.execute('CALL sp_create_category(?)', [name]);
        return rows[0][0].insertId;
    }

    /**
     * @brief Elimina una categoría por su identificador primario.
     * @param {number} id - Identificador de la categoría a remover.
     * @returns {Promise<boolean>} Retorna true si la operación se ejecutó con éxito.
     */
    async delete(id) 
    {
        await db.execute('CALL sp_delete_category(?)', [id]);
        return true;
    }
}

module.exports = new CategoryRepository();
