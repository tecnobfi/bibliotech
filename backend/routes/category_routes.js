/**
 * @file category_routes.js
 * @brief Rutas de la API para la gestión de categorías de libros.
 * @project Bibliotech
 * @author Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
 * @license http://www.gnu.org/licenses/gpl.txt GNU GPL 3.0
 * @date Noviembre 2026
 */

const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category_controller');
const { verifyToken } = require('../middleware/auth_middleware');
const { validateCategoryCreate, validateCategoryDelete } = require('../middleware/validation_middleware');

/**
 * @route GET /api/categories
 * @brief Obtiene el catálogo completo de categorías disponibles.
 * @note Acceso público o con sesión activa para alimentar los selectores de la interfaz.
 */
router.get('/', categoryController.getAllCategories);

/**
 * @route POST /api/categories
 * @brief Crea una nueva categoría.
 * @note Ruta protegida: requiere token de usuario autenticado y validación de entrada.
 */
router.post('/', verifyToken, validateCategoryCreate, categoryController.createCategory);

/**
 * @route DELETE /api/categories/:id
 * @brief Elimina una categoría por su identificador único.
 * @note Ruta protegida: requiere token de usuario autenticado y validación sintáctica del ID.
 */
router.delete('/:id', verifyToken, validateCategoryDelete, categoryController.deleteCategory);

module.exports = router;
