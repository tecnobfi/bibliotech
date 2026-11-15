/**
 * @file category_controller.js
 * @brief Controlador para la gestión y administración de categorías de libros.
 * @project Bibliotech
 * @author Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
 * @license http://www.gnu.org/licenses/gpl.txt GNU GPL 3.0
 * @date Noviembre 2026
 */

const categoryRepository = require('../repositories/category_repository');
const i18n = require('../utils/i18n/i18n');

/**
 * @class CategoryController
 * @brief Administra los endpoints de consulta, alta y baja de categorías.
 */
class CategoryController 
{
    /**
     * @brief Retorna todas las categorías registradas en el sistema.
     * @param {Object} req - Petición HTTP.
     * @param {Object} res - Respuesta HTTP.
     * @param {Function} next - Middleware para delegación de excepciones.
     */
    async getAllCategories(req, res, next) 
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

    /**
     * @brief Crea una nueva categoría en la base de datos.
     * @param {Object} req - Petición HTTP con req.body.name.
     * @param {Object} res - Respuesta HTTP.
     * @param {Function} next - Middleware para delegación de excepciones.
     */
    async createCategory(req, res, next) 
    {
        try 
        {
            const { name } = req.body;
            const insertId = await categoryRepository.create(name.trim());
            const message = i18n.getMessage('CT_CATEGORY_CREATED');
            res.status(201).json({ message, id: insertId, name: name.trim() });
        } 
        catch (error) 
        {
            next(error);
        }
    }

    /**
     * @brief Elimina una categoría del sistema por su ID.
     * @param {Object} req - Petición HTTP con req.params.id.
     * @param {Object} res - Respuesta HTTP.
     * @param {Function} next - Middleware para delegación de excepciones.
     */
    async deleteCategory(req, res, next) 
    {
        try 
        {
            const { id } = req.params;
            await categoryRepository.delete(parseInt(id, 10));
            const message = i18n.getMessage('CT_CATEGORY_DELETED');
            res.json({ message });
        } 
        catch (error) 
        {
            next(error);
        }
    }
}

module.exports = new CategoryController();
