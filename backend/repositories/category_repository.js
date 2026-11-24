const pool = require('../config/db');

class CategoryRepository
{
    /**
     * Consulta todas las categorías disponibles mediante el Stored Procedure.
     * @returns {Promise<Array>} Lista de objetos de categorías { id, name }
     */
    async getAll()
    {
        const [rows] = await pool.query('CALL sp_get_all_categories()');
        return rows[0];
    }
}

module.exports = new CategoryRepository();
