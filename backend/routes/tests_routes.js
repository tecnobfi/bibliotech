/**
 * @file tests_routes.js
 * @brief Rutas de navegación del Frontend para servir el laboratorio de pruebas unitarias.
 * @project Bibliotech
 * @author Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
 * @license http://www.gnu.org/licenses/gpl.txt GNU GPL 3.0
 * @date Octubre 2026
 */

 const express = require('express');
 const router = express.Router();
 const path = require('path');
 
 /**
  * @route GET /
  * @brief Punto de entrada para el entorno de Testing.
  * @details Este router solo se activa desde server.js si la variable 
  * process.env.NODE_ENV es igual a 'testing'. Permite aislar la interfaz 
  * de pruebas para que nunca sea accesible en un entorno de producción real.
  */
 router.get('/', (req, res) => {
     res.sendFile(path.join(__dirname, '../../frontend/html/tests.html'));
 });
 
 module.exports = router;