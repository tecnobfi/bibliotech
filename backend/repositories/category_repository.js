const db = require('../config/db');

class CategoryRepository
{
    /**
     * Consulta todas las categorías disponibles mediante Stored Procedure.
     * @returns {Promise<Array>} Lista de objetos de categorías { id, name }
     */
    async getAll()
    {
        const [rows] = await db.execute('CALL sp_get_all_categories()');

        return rows;
    }
}

module.exports = new CategoryRepository();
