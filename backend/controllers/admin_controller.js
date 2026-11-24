/**
 * @file admin_controller.js
 * @brief Controlador para la gestión y administración de usuarios del sistema.
 * @project Bibliotech
 * @author Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
 * @license http://www.gnu.org/licenses/gpl.txt GNU GPL 3.0
 * @date Octubre 2026
 */

const auditRepository = require('../repositories/audit_repository');
 const userRepository = require('../repositories/user_repository');
 const bookRepository = require('../repositories/book_repository');
 const fileHelper = require('../utils/file_helper/file_helper');
 const i18n = require('../utils/i18n/i18n'); // Inyección del gestor de idiomas
 
 /**
  * @class AdminController
  * @brief Agrupa la lógica de negocio para operaciones de alto privilegio (Administrador).
  */
 class AdminController 
 {
     /**
      * @brief Obtiene la lista completa de usuarios registrados y sus roles.
      * @param {Object} req - Petición HTTP.
      * @param {Object} res - Respuesta HTTP.
      * @param {Function} next - Función para delegar errores al Global Error Handler.
      */
     async getAllUsers(req, res, next)
     {
         try 
         {
             const users = await userRepository.findAll();
             res.json(users);
         }
         catch (error) 
         {
             next(error);
         }
     }
 
     /**
      * @brief Elimina un usuario del sistema y realiza una limpieza en cascada 
      * física de todos los documentos PDF asociados a él.
      * @param {Object} req - Petición HTTP (espera req.params.id y req.userId).
      * @param {Object} res - Respuesta HTTP.
      * @param {Function} next - Función para delegar errores al Global Error Handler.
      */
      async  deleteUser(req, res, next) {
        try {
         const targetUserId = parseInt(req.params.id);
         const adminId = req.userId; // Corregido: req.userId

         await adminRepository.softDeleteUser(targetUserId);

         // Asentar evento de auditoría
          auditRepository.logAction(adminId, 'SOFT_DELETE_USER', `User ID: ${targetUserId}`, req.ip);

         const message = i18n.getMessage('CT_USER_DELETED_SUCCESS');
         res.json({ message });
        } catch (error) {
         next(error);
        }
     }
}
 
 module.exports = new AdminController();