/**
 * @file admin_routes.js
 * @brief Rutas de la API exclusivas para operaciones de administración.
 * @project Bibliotech
 * @author Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
 * @license http://www.gnu.org/licenses/gpl.txt GNU GPL 3.0
 * @date Octubre 2026
 */

 const express = require('express');
 const router = express.Router();
 const adminController = require('../controllers/admin_controller');
 
 // Importamos los middlewares centralizados de seguridad
 const { verifyToken, isAdmin } = require('../middleware/auth_middleware');
 
 /**
  * @details Middleware a nivel de Router (Router-level middleware).
  * Al usar router.use() en la parte superior, aplicamos una "cadena de seguridad" 
  * obligatoria para TODOS los endpoints definidos debajo de esta línea.
  * El orden es vital (Pipeline):
  * 1. verifyToken: ¿Quién sos? (Filtra a los visitantes anónimos).
  * 2. isAdmin: ¿Tenés el nivel de privilegio adecuado? (Filtra a los clientes comunes).
  */
 router.use(verifyToken, isAdmin);
 
 /**
  * @route GET /api/admin/users
  * @brief Listar todos los usuarios registrados.
  */
 router.get('/users', adminController.getAllUsers);
 
 /**
  * @route DELETE /api/admin/users/:id
  * @brief Eliminar un usuario del sistema por su ID (incluyendo borrado en cascada).
  * @param id Identificador único del usuario (URL param).
  */
 router.delete('/users/:id', adminController.deleteUser);
 
 module.exports = router;