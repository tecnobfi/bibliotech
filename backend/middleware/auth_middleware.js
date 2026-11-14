/**
 * @file auth_middleware.js
 * @brief Middleware de autenticación y autorización utilizando JSON Web Tokens.
 * @project Bibliotech
 * @author Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
 * @license http://www.gnu.org/licenses/gpl.txt GNU GPL 3.0
 * @date Octubre 2026
 */

/**
 * @details JSON Web Token (JWT) es un estándar abierto (RFC 7519) compacto 
 * y seguro para transmitir información entre partes como un objeto JSON. 
 * Se utiliza principalmente para autenticación y autorización en 
 * aplicaciones web, permitiendo verificar la integridad de los datos 
 * mediante una firma digital (con clave secreta o par RSA).
 */
 const jwt = require('jsonwebtoken');
 const i18n = require('../utils/i18n/i18n'); // Inyección del gestor de idiomas
 
 /** 
  * @brief En producción, siempre usar variables de entorno (.env) para evitar 
  * exponer claves sensibles en el código fuente.
  */
 const SECRET_KEY = process.env.JWT_SECRET;
 
 const authMiddleware = {
     /** 
      * @brief Propiedad exportada para que SECRET_KEY sea accesible al importar el objeto authMiddleware.
      */
     SECRET_KEY,
 
     /**
      * @brief Verifica que el usuario esté logueado validando la firma y vigencia de su token JWT.
      * @param {Object} req - Objeto de petición HTTP de Express.
      * @param {Object} res - Objeto de respuesta HTTP de Express.
      * @param {Function} next - Función para pasar el control al siguiente middleware o controlador.
      * @returns {Object|void} Retorna un JSON con error 401/403 si falla, o llama a next() si el token es válido.
      */
     verifyToken: (req, res, next) => 
     {
         // Un mejor nombre es authHeader, porque esta cabecera puede traer otra información además del token
         const authHeader = req.headers['authorization'];
         
         // Mejora: Validación de formato Bearer segura
         if (!authHeader || !authHeader.startsWith('Bearer ')) 
         {
             const message = i18n.getMessage('CT_AUTH_TOKEN_FORMAT');
             return res.status(403).json({ message });
         }
 
         // El token o authHeader suele venir como "Bearer <token>", aquí extraemos exclusivamente el token
         const pureToken = authHeader.split(" ")[1];
 
         jwt.verify(pureToken, SECRET_KEY, (err, decoded) => 
         {
             if (err) 
             {
                 const message = i18n.getMessage('CT_AUTH_TOKEN_INVALID');
                 return res.status(401).json({ message });
             }
             
             // Guardamos la info del usuario decodificada en el request para persistirla en el ciclo de vida de la petición
             req.userId = decoded.id;
             req.userRole = decoded.role; // Extraemos el rol del token
             next(); // Continuar al siguiente controlador o middleware
         });
     },
 
     /**
      * @brief Verifica si el usuario activo posee privilegios de nivel Administrador.
      * @warning Este middleware debe ejecutarse estrictamente DESPUÉS de verifyToken en la cadena de rutas.
      * @param {Object} req - Objeto de petición HTTP de Express (debe contener req.userRole).
      * @param {Object} res - Objeto de respuesta HTTP de Express.
      * @param {Function} next - Función para pasar el control al siguiente eslabón.
      * @returns {Object|void} Retorna un JSON con error 403 si el usuario no es admin, o llama a next() si tiene el rol.
      */
     isAdmin: (req, res, next) => 
     {
         const roles = req.userRole; // Esto puede ser un string "admin" o un array ["client", "admin"]
 
         // Verificamos si el rol 'admin' está presente de forma flexible
         const hasAdminRole = Array.isArray(roles) 
             ? roles.includes('admin') 
             : roles === 'admin';
 
         if (!hasAdminRole) 
         {
             const message = i18n.getMessage('CT_AUTH_ADMIN_REQUIRED');
             return res.status(403).json({ message });
         }
         
         next();
     }    
 };
 
 module.exports = authMiddleware;