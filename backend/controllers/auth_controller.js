/**
 * @file auth_controller.js
 * @brief Controlador para gestionar el registro, autenticación y emisión de tokens.
 * @project Bibliotech
 * @author Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
 * @license http://www.gnu.org/licenses/gpl.txt GNU GPL 3.0
 * @date Octubre 2026
 */

 const bcrypt = require('bcrypt'); // Biblioteca para encriptar contraseñas
 const jwt = require('jsonwebtoken'); // Para generar tokens de sesión
 const userRepository = require('../repositories/user_repository'); // Repositorio de usuarios
 const i18n = require('../utils/i18n/i18n'); // Inyección del gestor de idiomas
 
 /**
  * Deserialización moderna: Importamos únicamente la constante SECRET_KEY del middleware.
  */ 
 const { SECRET_KEY } = require('../middleware/auth_middleware'); 
 
 /**
  * @class AuthController
  * @brief Orquesta el ciclo de vida de la identidad del usuario en el sistema.
  */
 class AuthController 
 {
     /**
      * @brief Registra un nuevo usuario cliente con contraseña hasheada de forma segura.
      * @param {Object} req - Petición HTTP (espera req.body.username y req.body.password).
      * @param {Object} res - Respuesta HTTP.
      * @param {Function} next - Función para delegar errores (ej. ER_DUP_ENTRY) al Global Error Handler.
      */
     async register(req, res, next) 
     {
         try 
         {
             const { username, password } = req.body;
 
             // Hashing seguro de contraseña con factor de costo 10
             const hashedPassword = await bcrypt.hash(password, 10);  
             
             // Persistencia mediante repositorio (asigna rol 'client' por defecto en el SP)
             const userId = await userRepository.create(username, hashedPassword, 'client');
             
             const message = i18n.getMessage('CT_AUTH_REGISTER_SUCCESS');
             res.status(201).json({ message, userId });
         } 
         catch (error) 
         {
             next(error);
         }
     }
 
     /**
      * @brief Autentica a un usuario verificando sus credenciales contra la base de datos.
      * @param {Object} req - Petición HTTP.
      * @param {Object} res - Respuesta HTTP.
      * @param {Function} next - Función para delegar errores al Global Error Handler.
      */
     async login(req, res, next) 
     {
         try 
         {
             const { username, password } = req.body;
 
             // Buscar usuario con su rol asociado
             const user = await userRepository.findByUsername(username);
 
             // Regla de Negocio Semántica: Verificar existencia de usuario y validación de hash bcrypt
             if (!user || !(await bcrypt.compare(password, user.password))) 
             {
                 const message = i18n.getMessage('CT_AUTH_INVALID_CREDS');
                 return res.status(401).json({ message });
             }
 
             // Generar token JWT con payload (id, role)
             const token = jwt.sign({ id: user.id, role: user.role },SECRET_KEY,{ expiresIn: '2h' });
 
             const message = i18n.getMessage('CT_AUTH_LOGIN_SUCCESS');
             res.json({ message, token, role: user.role });
         } 
         catch (error) 
         {
             next(error);
         }
     }
 }
 
 module.exports = new AuthController();