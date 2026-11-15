/**
 * @file book_repository.js
 * @brief Repositorio para la capa de acceso a datos de documentos PDF.
 * @project Bibliotech
 * @author Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
 * @license http://www.gnu.org/licenses/gpl.txt GNU GPL 3.0
 * @date Octubre 2026
 */

/**
 * @details El Patrón Repositorio actúa como un mediador entre la capa de dominio 
 * (controladores) y la capa de persistencia (MySQL). Centraliza el acceso a datos, 
 * evitando tener consultas SQL dispersas por toda la aplicación.
 */
const db = require('../config/db');

/**
 * @class BookRepository
 * @brief Maneja las operaciones CRUD de los libros encapsulando las llamadas a Procedimientos Almacenados.
 */
class BookRepository 
{
    /**
     * @brief Persiste un nuevo registro de libro en la base de datos.
     * @param {Object} bookData - DTO (Data Transfer Object) con los metadatos del libro.
     * @returns {Promise<number>} Retorna el ID (Primary Key) del registro insertado.
     * 
     * @note Prevención de SQL Injection: Al utilizar el método db.execute() con el array 
     * de parámetros [...], la librería mysql2 compila la consulta (Prepared Statements) 
     * sanitizando automáticamente los valores de entrada.
     */
    async create(bookData) 
    {
        const { user_id, filename, title, author, category_id, pages, file_path } = bookData;
        const [rows] = await db.execute('CALL sp_create_book(?, ?, ?, ?, ?, ?, ?)',
            [user_id, filename, title, author, category_id, pages, file_path]);
            
        // Los Stored Procedures de inserción fueron diseñados para devolver LAST_INSERT_ID()
        return rows[0][0].insertId;
    }

    /**
     * @brief Obtiene el listado completo de documentos pertenecientes a un cliente.
     * @param {number} userId - Identificador único del usuario.
     * @returns {Promise<Array>} Retorna un array de objetos libro.
     */
    async findByUserId(userId) 
    {
        const [rows] = await db.execute('CALL sp_find_books_by_user(?)', [userId]);
        return rows[0];
    }

    /**
     * @brief Busca un documento específico validando mediante DB que pertenezca al usuario solicitante.
     * @param {number} id - ID del libro.
     * @param {number} userId - ID del usuario activo (propietario esperado).
     * @returns {Promise<Object|undefined>} Retorna el objeto del libro o undefined si no existe/no le pertenece.
     */
    async findById(id, userId) 
    {
        const [rows] = await db.execute('CALL sp_find_book_by_id(?, ?)', [id, userId]);
        return rows[0][0]; 
    }


    /**
     * @brief Actualiza los metadatos de un libro existente.
     * @details Ejecuta un Stored Procedure que verifica la propiedad
     * del documento antes de modificar sus datos.
     * @param {number} id - Identificador del libro.
     * @param {number} userId - Identificador del usuario autenticado.
     * @param {Object} bookData - Nuevos metadatos del libro.
     * @returns {Promise<number>} Cantidad de filas actualizadas.
     */
    async update(id, userId, bookData)
    {
        const { title, author, category_id, pages } = bookData;

        const [rows] = await db.execute(
            'CALL sp_update_book_metadata(?, ?, ?, ?, ?, ?)',
            [id, userId, title, author, category_id, pages]
        );

        return rows[0][0].affectedRows;
    }


    /**
     * @brief Elimina un documento de la base de datos.
     * @param {number} id - ID del libro.
     * @param {number} userId - ID del usuario activo (propietario esperado).
     * @returns {Promise<boolean>} Retorna true si la ejecución del SP finalizó sin excepciones.
     */
    async delete(id, userId) 
    {
        await db.execute('CALL sp_delete_book(?, ?)', [id, userId]);
        return true;
    }
}

module.exports = new BookRepository();
