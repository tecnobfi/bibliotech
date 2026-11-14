/**
 * @file book_routes.js
 * @brief Rutas de la API para la gestión documental de libros PDF.
 * @project Bibliotech
 * @author Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
 * @license http://www.gnu.org/licenses/gpl.txt GNU GPL 3.0
 * @date Octubre 2026
 */

 const express = require('express');
 const router = express.Router();
 const bookController = require('../controllers/book_controller');
 const uploadMiddleware = require('../config/multer_config');
 const { verifyToken } = require('../middleware/auth_middleware');
 const { validateBookUpload } = require('../middleware/validation_middleware');
 
 /**
  * @brief Todas las rutas de la biblioteca son privadas y requieren una sesión activa.
  */
 router.use(verifyToken);
 
 /**
  * @route POST /api/books/upload
  * @brief Cargar un nuevo documento PDF.
  * @note Pipeline complejo: 
  * 1. `uploadMiddleware` (Multer) intercepta la petición multipart, guarda el archivo en disco e inyecta req.file.
  * 2. `validateBookUpload` verifica la presencia del archivo y las reglas de negocio.
  * 3. `bookController.uploadBook` persiste los metadatos en la base de datos.
  */
 router.post('/upload', uploadMiddleware, validateBookUpload, bookController.uploadBook);
 
 /**
  * @route GET /api/books/my-books
  * @brief Obtener la biblioteca completa del cliente autenticado.
  */
 router.get('/my-books', bookController.getMyBooks);
 
 /**
  * @route DELETE /api/books/:id
  * @brief Eliminar un documento por su ID.
  */
 router.delete('/:id', bookController.deleteBook);
 
 module.exports = router;