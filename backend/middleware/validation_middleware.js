/**
 * @file validation_middleware.js
 * @brief Middleware de validación sintáctica actuando como "Escudo Preventivo" (Fail-Fast).
 * @project Bibliotech
 * @author Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
 * @license http://www.gnu.org/licenses/gpl.txt GNU GPL 3.0
 * @date Octubre 2026
 */

/**
 * @details Este módulo implementa el principio de Separación de Responsabilidades (SoC).
 * Verifica que los datos de entrada posean el formato y las propiedades estructurales 
 * correctas antes de permitir que la petición alcance la capa de Controladores y 
 * la lógica de negocio semántica. Utiliza un motor de validación basado en el 
 * patrón Fluent Interface.
 */
 const Validator = require('../utils/validator/validator');
 const Required = require('../utils/validator/rules/required');
 const MinLength = require('../utils/validator/rules/min_length');
 const PositiveNumber = require('../utils/validator/rules/positive_number');
 const fileHelper = require('../utils/file_helper/file_helper');
 
 const validationMiddleware = {
     
     /**
      * @brief Valida la estructura de los datos requeridos para registrar un nuevo usuario.
      * @param {Object} req - Objeto de petición HTTP (req.body debe contener username y password).
      * @param {Object} res - Objeto de respuesta HTTP.
      * @param {Function} next - Pasa el control al controlador si la validación es exitosa.
      * @returns {Object|void} Retorna HTTP 400 Bad Request en caso de fallo sintáctico.
      */
     validateRegister: (req, res, next) => 
     {
         const { username, password } = req.body;
         const validator = new Validator();
         
         try 
         {
             // Fluent Interface: Encadenamiento imperativo de reglas sobre un mismo objetivo
             validator.validateThis(username).with(new Required("CT_REQ_USERNAME"));
             
             validator.validateThis(password)
                      .with(new Required("CT_REQ_PASSWORD"))
                      .with(new MinLength(5, "CT_PASS_TOO_SHORT"));
             
             next();
         } 
         catch (error) 
         {
             // Las reglas lanzan una excepción con el mensaje ya traducido (i18n)
             return res.status(400).json({ message: error.message });
         }
     },
 
     /**
      * @brief Valida la presencia de credenciales mínimas antes de intentar un inicio de sesión.
      * @param {Object} req - Objeto de petición HTTP.
      * @param {Object} res - Objeto de respuesta HTTP.
      * @param {Function} next - Función de delegación de Express.
      */
     validateLogin: (req, res, next) => 
     {
         const { username, password } = req.body;
         const validator = new Validator();
 
         try 
         {
             // Se re-utiliza la regla "Required" inyectando distintas claves de traducción
             validator.validateThis(username).with(new Required("CT_REQ_CREDENTIALS"));
             validator.validateThis(password).with(new Required("CT_REQ_CREDENTIALS"));
             
             next();
         } 
         catch (error) 
         {
             return res.status(400).json({ message: error.message });
         }
     },
 
     /**
      * @brief Valida la integridad de un formulario Multipart (texto + archivo PDF) para la carga de libros.
      * @param {Object} req - Petición HTTP (procesada previamente por Multer, incluye req.file y req.body).
      * @param {Object} res - Objeto de respuesta HTTP.
      * @param {Function} next - Función de delegación de Express.
      */
     validateBookUpload: (req, res, next) => 
     {
         const validator = new Validator();
         const { title, author, categoryId: category, pages } = req.body;
 
         try 
         {
             // Validación específica de presencia de archivo. 
             // Multer procesa el archivo antes que este middleware valide los campos de texto.
             if (!req.file) 
             {
                 throw new Error(validator.i18n.getMessage("CT_FILE_REQUIRED"));
             }
 
             validator.validateThis(title).with(new Required("CT_REQ_TITLE"));
             validator.validateThis(author).with(new Required("CT_REQ_AUTHOR"));
             validator.validateThis(category).with(new Required("CT_REQ_CATEGORY"));
             validator.validateThis(pages).with(new PositiveNumber("CT_PAGES_POSITIVE"));
 
             next();
         } 
         catch (error) 
         {
             /**
              * @note Rollback de Archivo: Si el archivo fue subido exitosamente a la carpeta temporal 
              * por Multer, pero los campos de texto fallan la validación, debemos eliminar físicamente 
              * el archivo huérfano para evitar fugas de almacenamiento (Storage Leaks).
              */
             if (req.file) 
             {
                 fileHelper.deleteFile(`/uploads/${req.file.filename}`);
             }
             return res.status(400).json({ message: error.message });
         }
     },

    /**
     *@brief Valida los metadatos enviados para modificar un documento existente.
     * @param {Object} req - Petición HTTP (req.body contiene los nuevos metadatos).
     * @param {Object} res - Respuesta HTTP.
     * @param {Function} next - Permite continuar hacia el controlador.
    */
   
     validateBookUpdate: (req,res,next) =>

    {
         const validator = new Validator();
         const { title, author, category, pages } = req.body;

         try 
         {
              validator.validateThis(title).with(new Required("CT_REQ_TITLE"));
              validator.validateThis(author).with(new Required("CT_REQ_AUTHOR"));
              validator.validateThis(category).with(new Required("CT_REQ_CATEGORY"));
              validator.validateThis(pages).with(new PositiveNumber("CT_PAGES_POSITIVE"));

              next();
         } 
         catch (error) 
         {
              return res.status(400).json({ message: error.message });
         }
    }
 };
 
 module.exports = validationMiddleware;