/**
 * @file audit_routes.js
 * @brief Rutas de la API para la consulta del registro de auditoría.
 * @project Bibliotech
 * @author Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
 * @license http://www.gnu.org/licenses/gpl.txt GNU GPL 3.0
 * @date Noviembre 2026
 */

 const express = require('express');
 const router = express.Router();
 const auditController = require('../controllers/audit_controller');
 const { verifyToken, isAdmin } = require('../middleware/auth_middleware');

 /**
  * @details El historial de auditoría expone quién hizo qué y desde qué IP, por lo que
  * es información sensible: se aplica la misma cadena de seguridad que en admin_routes.
  * 1. verifyToken: filtra a los visitantes anónimos.
  * 2. isAdmin: filtra a los clientes comunes.
  */
 router.use(verifyToken, isAdmin);

 /**
  * @route GET /api/audit/logs
  * @brief Listar el historial completo de eventos auditados (del más reciente al más antiguo).
  */
 router.get('/logs', auditController.getAllLogs);

 module.exports = router;
