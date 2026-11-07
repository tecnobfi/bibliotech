/*
 * @file init.sql
 * @brief Script de inicialización (Bootstrap) de la base de datos, tablas y procedimientos.
 * @project Bibliotech
 * @author Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
 * @license http://www.gnu.org/licenses/gpl.txt GNU GPL 3.0
 * @date Octubre 2026
 */

/* 
 * @details Configuración inicial del entorno. 
 * Desactivar 'foreign_key_checks' temporalmente permite borrar y recrear tablas 
 * sin preocuparnos por el orden estricto de las dependencias relacionales.
 */
SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

-- 1. Borrar la base de datos si existe y crearla limpia
DROP DATABASE IF EXISTS bibliotech;
CREATE DATABASE bibliotech;
USE bibliotech;

/*
 * @brief 2. Configuración de Seguridad y Creación de Usuario
 * @note Principio de Menor Privilegio (PoLP): La aplicación Node.js NO debe 
 * conectarse como 'root'. Le creamos un usuario dedicado que SOLO tiene permiso 
 * para ejecutar Procedimientos Almacenados (EXECUTE) y leer vistas/tablas (SELECT). 
 * Este usuario NO puede hacer DROP, ALTER ni DELETE directo.
 */
CREATE USER IF NOT EXISTS 'bibliotech'@'localhost' IDENTIFIED BY 'bibliotech';
GRANT SELECT, EXECUTE ON bibliotech.* TO 'bibliotech'@'localhost';

/*
 * @brief 3. Tablas maestras y transaccionales
 */

-- Tabla de Roles (Normalización)
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20) NOT NULL UNIQUE
);

-- Tabla de Usuarios
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/*
 * @brief 5. Relación Muchos a Muchos (N:M)
 * @details Tabla intermedia o pivot. 
 * @note Integridad Referencial: ON DELETE CASCADE asegura que si borramos un 
 * usuario, sus asignaciones de roles se destruyan automáticamente, evitando 
 * registros huérfanos (Orphaned Records).
 */
CREATE TABLE users_roles (
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

/*
 * @brief 6. Tabla de Libros/Documentos (Relación 1:N con Usuarios)
 */
CREATE TABLE books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    filename VARCHAR(255) NOT NULL,
    title VARCHAR(100) NOT NULL,
    author VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    pages INT DEFAULT 0,
    file_path VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 7. Inserción de Roles Maestros
INSERT INTO roles (name) VALUES ('admin'), ('client');

/*
 * @brief 8. Datos Semilla (Seed Data) para desarrollo
 * @warning Las contraseñas están hasheadas con bcrypt ($2b$10$...). 
 * En texto plano equivalen a '12345'.
 */
INSERT INTO users (id, username, password) VALUES (1, 'admin', '$2b$10$.n0s847tiSxBqDvIo6Vg5ujXC5zIUmm98bTjBWnRdqX9CxxbIo7wS');
INSERT INTO users_roles (user_id, role_id) VALUES (1, 1); 

INSERT INTO users (id, username, password) VALUES (2, 'pepe', '$2b$10$.n0s847tiSxBqDvIo6Vg5ujXC5zIUmm98bTjBWnRdqX9CxxbIo7wS');
INSERT INTO users_roles (user_id, role_id) VALUES (2, 2); 


/*
 * ==========================================================
 * 9. PROCEDIMIENTOS ALMACENADOS (Stored Procedures)
 * ==========================================================
 * 
 * @details Un Procedimiento Almacenado encapsula la lógica de negocio en la 
 * base de datos. 
 * @note DELIMITER // : Cambiamos el delimitador estándar (;) por (//) temporalmente.
 * Esto permite que MySQL entienda que los (;) dentro del bloque BEGIN...END 
 * son parte de las instrucciones del procedimiento y no el final del CREATE PROCEDURE.
 */

DELIMITER //

-- --- PROCEDIMIENTOS PARA USERS ---

/*
 * @brief Busca usuario por username y resuelve su rol mediante JOINs.
 * @param p_username Nombre de usuario exacto.
 */
CREATE PROCEDURE sp_find_user_by_username(IN p_username VARCHAR(50))
BEGIN
    SELECT u.*, r.name as role 
    FROM users u
    JOIN users_roles ur ON u.id = ur.user_id
    JOIN roles r ON ur.role_id = r.id
    WHERE u.username = p_username;
END //

/*
 * @brief Crea un nuevo usuario y su relación con un rol específico en una transacción implícita.
 * @param p_username Nombre del usuario.
 * @param p_password Hash bcrypt de la contraseña.
 * @param p_role_name Nombre del rol (ej: 'client').
 */
CREATE PROCEDURE sp_create_user(
    IN p_username VARCHAR(50), 
    IN p_password VARCHAR(255), 
    IN p_role_name VARCHAR(20)
)
BEGIN
    DECLARE v_user_id INT;
    DECLARE v_role_id INT;

    INSERT INTO users (username, password) VALUES (p_username, p_password);
    SET v_user_id = LAST_INSERT_ID();

    SELECT id INTO v_role_id FROM roles WHERE name = p_role_name;
    INSERT INTO users_roles (user_id, role_id) VALUES (v_user_id, v_role_id);
    
    SELECT v_user_id as insertId;
END //

-- Listar todos los usuarios con su rol
CREATE PROCEDURE sp_find_all_users()
BEGIN
    SELECT u.id, u.username, r.name as role, u.created_at 
    FROM users u
    JOIN users_roles ur ON u.id = ur.user_id
    JOIN roles r ON ur.role_id = r.id;
END //

-- Borrar usuario por ID
CREATE PROCEDURE sp_delete_user(IN p_id INT)
BEGIN
    DELETE FROM users WHERE id = p_id;
END //

-- --- PROCEDIMIENTOS PARA BOOKS ---

/*
 * @brief Registra los metadatos de un archivo PDF subido al servidor.
 */
CREATE PROCEDURE sp_create_book(
    IN p_user_id INT,
    IN p_filename VARCHAR(255),
    IN p_title VARCHAR(100),
    IN p_author VARCHAR(100),
    IN p_category VARCHAR(50),
    IN p_pages INT,
    IN p_file_path VARCHAR(255)
)
BEGIN
    INSERT INTO books (user_id, filename, title, author, category, pages, file_path)
    VALUES (p_user_id, p_filename, p_title, p_author, p_category, p_pages, p_file_path);
    SELECT LAST_INSERT_ID() as insertId;
END //

-- Listar libros asociados a un usuario específico
CREATE PROCEDURE sp_find_books_by_user(IN p_user_id INT)
BEGIN
    SELECT * FROM books WHERE user_id = p_user_id;
END //

/*
 * @brief Busca un libro específico (Validando autoría)
 * @note Seguridad: Se exige el p_user_id para evitar que un cliente modifique 
 * un id en la URL y acceda a un libro que no le pertenece (Insecure Direct Object Reference).
 */
CREATE PROCEDURE sp_find_book_by_id(IN p_id INT, IN p_user_id INT)
BEGIN
    SELECT * FROM books WHERE id = p_id AND user_id = p_user_id;
END //

/*
 * @brief Borrar libro (Validando autoría)
 */
CREATE PROCEDURE sp_delete_book(IN p_id INT, IN p_user_id INT)
BEGIN
    DELETE FROM books WHERE id = p_id AND user_id = p_user_id;
END //

DELIMITER ;
SET foreign_key_checks = 1;