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
 const auditController = require('./audit_controller'); // Capa de Auditoría (Requerimiento B)
 
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
             const { title, author, category, pages } = req.body;
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
 
             // Obtener información del libro para validar propiedad y conocer ruta física
             const book = await bookRepository.findById(id, userId);
             
             if (!book) 
             {
                 const message = i18n.getMessage('CT_BOOK_NOT_FOUND');
                 return res.status(404).json({ message });
             }
 
             // Eliminar registro en base de datos
             await bookRepository.delete(id, userId);
 
             // Eliminar archivo físico en disco de forma síncrona
             fileHelper.deleteFile(book.file_path); 

             /**
              * @note Auditoría (Requerimiento B): se registra recién acá, cuando el borrado ya se
              * confirmó (un 404 nunca llega a esta línea). logEvent no usa await: el registro corre
              * en segundo plano y no demora la respuesta al cliente.
              * El target incluye el título porque, una vez borrado el libro, 'book:15' solo ya no
              * permitiría saber qué documento era (análisis forense).
              */
             auditController.logEvent(userId, auditController.ACTIONS.DELETE_BOOK,
                 `book:${book.id} (${book.title})`, req.ip);
             
             const message = i18n.getMessage('CT_BOOK_DELETED_SUCCESS');
             res.json({ message });
         }
         catch (error)
         {
             next(error);
         }
     }
  /**
 
@brief Procesa la solicitud HTTP PUT para actualizar los metadatos de un libro.
@param {Object} req - Petición HTTP Express.
@param {Object} res - Respuesta HTTP Express.
@param {Function} next - Función para delegar errores al Global Error Handler.*/
async updateBook(req, res, next)
{
    try
    {
        const bookId = parseInt(req.params.id);
        const ownerId = req.userId;

        const { title, author, pages, categoryId } = req.body;

        await bookRepository.updateMetadata(
            bookId,
            ownerId,
            title,
            author,
            pages,
            categoryId
        );

        const message = i18n.getMessage('CT_BOOK_UPDATE_SUCCESS');

        res.status(200).json({ message });
    }
    catch (error)
    {
        next(error);
    }
}   
     
     
 }
 
 module.exports = new BookController();