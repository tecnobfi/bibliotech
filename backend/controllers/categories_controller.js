/**
 * @file categories_controller.js
 * @brief Controlador para la gestión y consulta de categorías.
 * @project Bibliotech
 * @author Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
 * @license http://www.gnu.org/licenses/gpl.txt GNU GPL 3.0
 * @date Noviembre 2026
 */

const categoriesRepository = require ('../repositories/categories_repository');

/**
 * @class CategoriesController
 * @brief Administra las solicitudes relacionadas con las categorías.
 */
class CategoriesController 
{
    /**
     * @brief Obtiene todas las categorías disponibles.
     * @param {Object} req - Petición HTTP.
     * @param {Object} res - Respuesta HTTP.
     * @param {Function} next - Función para delegar errores.
     */   
    async getAllCategories(req,res,next)
    {
        try
        {
            const categories = await categoriesRepository.findAll();

            res.json(categories);            
        }
        catch (error)
        {
            next(error);
        }
    }
}

module.exports = new CategoriesController();