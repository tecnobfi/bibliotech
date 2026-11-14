/**
 * @file auth_routes.js
 * @brief Rutas de la API para la gestión de identidad, registro y emisión de tokens.
 * @project Bibliotech
 * @author Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
 * @license http://www.gnu.org/licenses/gpl.txt GNU GPL 3.0
 * @date Octubre 2026
 */

 const express = require('express');
 const router = express.Router();
 const authController = require('../controllers/auth_controller');
 const { validateRegister, validateLogin } = require('../middleware/validation_middleware');
 
 /**
  * @route POST /api/auth/register
  * @brief Crea una nueva cuenta de cliente.
  * @details Utiliza validación intermedia (Route-specific middleware). La petición 
  * primero pasa por `validateRegister` (escudo sintáctico) y, solo si tiene 
  * el formato correcto, avanza a `authController.register` (lógica semántica).
  */
 router.post('/register', validateRegister, authController.register);
 
 /**
  * @route POST /api/auth/login
  * @brief Inicia sesión y devuelve un JWT.
  */
 router.post('/login', validateLogin, authController.login);
 
 module.exports = router;