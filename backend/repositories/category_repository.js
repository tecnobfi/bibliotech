const db = require('../config/db');

/**
 * @class CategoryRepository
 * @brief Acceso a datos de categorías mediante Stored Procedures.
 */

class CategoryRepository
{
    /**
     * @brief Obtiene todas las categorías disponibles.
     * @returns {Promise<Array>} Lista de objetos {id, name}.
     * @note Consulta paramétrica vía SP: sin SQL inline (prevención de inyección).
     */
        async findAll()
    {
        const [rows] = await db.execute('CALL sp_get_all_categories()');
        return rows[0];
    }

    /*nota: para el agregado de añadir categorías*/
    async create(name)
    {
        const [rows] = await db.execute('CALL sp_create_category(?)', [name]);
        return rows[0][0].insertId;
    }
}

module.exports = new CategoryRepository();