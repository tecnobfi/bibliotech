/**
 * @file book_controller.js
 * @brief Controlador para la gestión documental, carga y borrado de archivos PDF.
 * @project Bibliotech
 * @author Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
 * @license http://www.gnu.org/licenses/gpl.txt GNU GPL 3.0
 * @date Octubre 2026
 */

 const fileHelper = require('../utils/file_helper/file_helper');
 const bookRepository = require('../repositories/book_repository');
 const i18n = require('../utils/i18n/i18n'); // Inyección del gestor de idiomas
 const auditRepository = require('../repositories/audit_repository');

 /**
  * @class BookController
  * @brief Administra la interacción del cliente con su biblioteca privada.
  */
 class BookController 
 {
     /**
      * @brief Sube un libro PDF y guarda sus metadatos en la base de datos.
      * @param {Object} req - Petición HTTP Multipart.
      * @param {Object} res - Respuesta HTTP.
      * @param {Function} next - Función para delegar errores al Global Error Handler.
      */
     async uploadBook(req, res, next) 
     {
         try 
         {
             const { title, author, category: categoryId, pages } = req.body;
             const userId = req.userId;
             const filename = req.file.filename;
             const filePath = `/uploads/${filename}`;
 
             // Persistencia de metadatos mediante Stored Procedure
             const insertId = await bookRepository.create({
                 user_id: userId,
                 filename,
                 title,
                 author,
                 category,
                 pages: parseInt(pages) || 0,
                 file_path: filePath
             });
 
             const message = i18n.getMessage('CT_BOOK_UPLOAD_SUCCESS');
             res.status(201).json({ message, id: insertId, path: filePath });
         } 
         catch (error) 
         {
             // Regla de Integridad: Limpieza física preventiva si la base de datos falla
             if (req.file) 
             {
                 fileHelper.deleteFile(`/uploads/${req.file.filename}`);
             }
             next(error);
         }
     }
 
     /**
      * @brief Lista todos los libros pertenecientes al usuario autenticado.
      * @param {Object} req - Petición HTTP.
      * @param {Object} res - Respuesta HTTP.
      * @param {Function} next - Función para delegar errores.
      */
     async getMyBooks(req, res, next)
     {
         try 
         {
             const books = await bookRepository.findByUserId(req.userId);
             res.json(books);
         } 
         catch (error) 
         {
             next(error);
         }
     }
 
     /**
      * @brief Elimina un documento específico validando previamente la propiedad del mismo.
      * @param {Object} req - Petición HTTP.
      * @param {Object} res - Respuesta HTTP.
      * @param {Function} next - Función para delegar errores.
      */
    async deleteBook(req, res, next) 
    {
       try 
       {
        const { id } = req.params;
        const userId = req.userId;

        // Obtener información del libro para validar propiedad
        const book = await bookRepository.findById(id, userId);

        if (!book) 
        {
            const message = i18n.getMessage('CT_BOOK_NOT_FOUND');
            return res.status(404).json({ message });
        }

        // Eliminar registro en base de datos
        await bookRepository.delete(id, userId);

        // Registrar la acción en la tabla audit_logs
        await auditRepository.create(
            userId,
            'DELETE_BOOK',
            `BOOK:${id}`,
            req.ip || null
        );

        // Eliminar archivo físico en disco
        fileHelper.deleteFile(book.file_path); 

        const message = i18n.getMessage('CT_BOOK_DELETED_SUCCESS');
        res.json({ message });
        }
        catch (error)
        {
          next(error);
        }
    }

     /**
      * @brief Gestiona la actualización de los metadatos de un documento.
      * @param {Object} req - Objeto de petición HTTP con el ID y los nuevos metadatos.
      * @param {Object} res - Objeto de respuesta HTTP.
      * @param {Function} next - Función para transferir los errores al middleware global.
      * @details Obtiene el ID del documento desde req.params, los nuevos metadatos
      * desde req.body y el ID del usuario autenticado desde req.userId.
      * Luego invoca al repositorio para realizar la actualización y devuelve
      * una respuesta al cliente.
      * @returns {Promise<void>} No devuelve un valor directamente; envía la respuesta HTTP.
      */
     async updateBook(req,res,next) 
     {
         try
         {
            const{ id } = req.params;
            const { title, author, category, pages } = req.body;
            const userId = req.userId;

            await bookRepository.update(id, userId, {
                title,
                author,
                category,
                pages: parseInt(pages)
            });

            const message = i18n.getMessage('CT_BOOK_UPDATE_SUCCESS');

            res.json({ message });
         }
         catch (error)
         {
             next(error);
         }
     }
 }
 
 module.exports = new BookController();