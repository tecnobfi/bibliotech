 /**
 * @file categories_routes.js
 * @brief Rutas para la consulta de categorías.
 * @project Bibliotech
 * @author Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
 * @license http://www.gnu.org/licenses/gpl.txt GNU GPL 3.0
 * @date Noviembre 2026
 */

 const express = require('express');
 const router = express.Router();
 
 
 const categoriesController = require ('../controllers/categories_controller');

// Obtener todas las categorías
router.get('/', categoriesController.getAllCategories);

module.exports = router;