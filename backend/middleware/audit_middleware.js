/**
 * @file audit_middleware.js
 * @brief Middleware de registro automático de acciones críticas en el log de auditoría.
 * @project Bibliotech
 * @author Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
 * @license http://www.gnu.org/licenses/gpl.txt GNU GPL 3.0
 * @date Noviembre 2026
 */

/**
 * @details En lugar de agregar una llamada a la auditoría dentro de cada controlador,
 * la auditoría se inyecta como un eslabón más del pipeline de Express, directamente en
 * la definición de la ruta. Así los controladores (book_controller, admin_controller)
 * mantienen una única responsabilidad y la auditoría queda visible en las rutas:
 * leyendo book_routes.js ya se sabe qué acciones quedan registradas.
 */
 const auditController = require('../controllers/audit_controller');

 const auditMiddleware = {
     /**
      * @brief Fábrica (Factory) que genera un middleware para auditar una acción específica.
      * @param {string} action - Código de la acción (usar auditController.ACTIONS).
      * @param {string} resourceType - Tipo de recurso afectado (ej: 'book', 'user').
      * @returns {Function} Middleware de Express (req, res, next).
      *
      * @details Se usa una función que retorna otra función (closure) para poder
      * configurar el middleware en cada ruta: auditAction(ACTIONS.DELETE_BOOK, 'book').
      *
      * @note Por qué esperar al evento 'finish' de la respuesta: el middleware se ejecuta
      * ANTES que el controlador, cuando todavía no sabemos si el borrado va a funcionar.
      * Escuchando 'finish' registramos el evento recién cuando la respuesta ya se envió,
      * y solo si fue exitosa (código 2xx). Un intento fallido (404 libro inexistente,
      * 403 auto-eliminación) no se registra como si la acción hubiera ocurrido.
      *
      * @note El actor, el recurso y la IP se capturan antes de llamar a next(), porque
      * al terminar el ciclo de la petición Express puede restaurar req.params al estado
      * del router padre y perderíamos el :id.
      */
     auditAction: (action, resourceType) =>
     {
         return (req, res, next) =>
         {
             const userId = req.userId; // Inyectado previamente por verifyToken
             const target = `${resourceType}:${req.params.id}`;
             const ipAddress = req.ip || null;

             res.on('finish', () =>
             {
                 if (res.statusCode >= 200 && res.statusCode < 300)
                 {
                     // Registro asincrónico: no bloquea ni afecta la respuesta ya enviada
                     auditController.logEvent(userId, action, target, ipAddress);
                 }
             });

             next();
         };
     }
 };

 module.exports = auditMiddleware;
