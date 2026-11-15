/**
 * @file audit_controller.js
 * @brief Controlador del módulo de Trazabilidad y Auditoría (registro y consulta de eventos).
 * @project Bibliotech
 * @author Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
 * @license http://www.gnu.org/licenses/gpl.txt GNU GPL 3.0
 * @date Noviembre 2026
 */

 const auditRepository = require('../repositories/audit_repository');

 /**
  * @brief Catálogo de acciones auditables del sistema.
  * @details Centralizar los códigos en una constante evita errores de tipeo
  * (ej: 'DELETE_BOK') que harían que un evento quede registrado con un nombre
  * distinto y no aparezca al buscarlo. Object.freeze impide modificarlo en tiempo de ejecución.
  */
 const AUDIT_ACTIONS = Object.freeze({
     DELETE_BOOK: 'DELETE_BOOK',
     DELETE_USER: 'DELETE_USER'
 });

 /**
  * @class AuditController
  * @brief Gestiona el registro de eventos críticos y la consulta del historial de auditoría.
  */
 class AuditController
 {
     constructor()
     {
         this.ACTIONS = AUDIT_ACTIONS;
     }

     /**
      * @brief Registra un evento de auditoría de forma asincrónica (fire-and-forget).
      * @param {number} userId - ID del usuario que ejecuta la acción (el actor).
      * @param {string} action - Código de la acción (usar AuditController.ACTIONS).
      * @param {string} target - Recurso afectado (ej: 'book:15', 'user:3').
      * @param {string|null} ipAddress - IP de origen de la petición (opcional).
      *
      * @details El método NO usa await a propósito: lanza la escritura en la base de datos
      * y retorna inmediatamente. Así el usuario recibe su respuesta sin esperar a que
      * termine el registro del log, tal como pide el requerimiento ("de forma asincrónica").
      *
      * @note Por qué el .catch() en lugar de next(error): si la auditoría falla, la acción
      * principal (borrar un libro o un usuario) ya se realizó con éxito y no debe reportarse
      * como un error al cliente. Además, una promesa rechazada sin .catch() provoca un
      * 'unhandledRejection' que puede tirar abajo el proceso de Node.js. Por eso el fallo
      * solo se informa en la consola del servidor.
      */
     logEvent(userId, action, target, ipAddress = null)
     {
         auditRepository.create(userId, action, target, ipAddress)
             .catch(error =>
             {
                 console.error(`[Audit] No se pudo registrar el evento ${action} sobre ${target}:`, error.message);
             });
     }

     /**
      * @brief Obtiene el historial completo de auditoría (Uso exclusivo de Admin).
      * @param {Object} req - Petición HTTP.
      * @param {Object} res - Respuesta HTTP.
      * @param {Function} next - Función para delegar errores al Global Error Handler.
      *
      * @note La restricción de acceso (verifyToken + isAdmin) se aplica en la capa de rutas,
      * no en el controlador, siguiendo el mismo esquema que admin_controller.
      */
     async getAllLogs(req, res, next)
     {
         try
         {
             const logs = await auditRepository.findAll();
             res.json(logs);
         }
         catch (error)
         {
             next(error);
         }
     }
 }

 module.exports = new AuditController();
