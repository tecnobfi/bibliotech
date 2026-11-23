const categoryRepository = require('../repositories/category_repository');
const i18n = require('../utils/i18n/i18n'); /*@nota: modificación*/

class CategoryController
{
    /**
     * @brief Lista todas las categorías.
     * @param {Function} next - Delega errores al global_error_middleware.
     */
    async getAll(req, res, next)
    {
        try
        {
            const categories = await categoryRepository.findAll();
            res.json(categories);
        }
        catch (error)
        {
            next(error);
        }
    }

    async create(req, res, next)
    {
        try
        {
            const { name } = req.body;
            const insertId = await categoryRepository.create(name.trim());

            const message = i18n.getMessage('CT_CATEGORY_CREATED_SUCCESS');
            res.status(201).json({ message, id: insertId, name: name.trim() });
        }
        catch (error)
        {
            next(error);
        }
    }
}
module.exports = new CategoryController();