/**
 * @file init.sql
 * @brief Script de inicialización (Bootstrap) de la base de datos, tablas y procedimientos.
 * @project Bibliotech
 * @author Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
 * @license http://www.gnu.org/licenses/gpl.txt GNU GPL 3.0
 * @date Octubre 2026
 */

/*
 * Configuración inicial del entorno.
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
 * 2. Configuración de Seguridad y Creación de Usuario
 * Principio de Menor Privilegio (PoLP): La aplicación Node.js NO debe
 * conectarse como 'root'. Le creamos un usuario dedicado que SOLO tiene permiso
 * para ejecutar Procedimientos Almacenados (EXECUTE) y leer vistas/tablas (SELECT).
 */
CREATE USER IF NOT EXISTS 'bibliotech'@'localhost' IDENTIFIED BY 'bibliotech';
GRANT SELECT, EXECUTE ON bibliotech.* TO 'bibliotech'@'localhost';

/*
 * 3. Tablas maestras y transaccionales
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
 * 5. Relación Muchos a Muchos (N:M)
 * Tabla intermedia o pivot con ON DELETE CASCADE.
 */
CREATE TABLE users_roles (
  user_id INT NOT NULL,
  role_id INT NOT NULL,
  PRIMARY KEY (user_id, role_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

/*
 * 6. Tabla de Libros/Documentos (Relación 1:N con Usuarios)
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
 * 8. Datos Semilla (Seed Data) para desarrollo
 */
INSERT INTO users (id, username, password) VALUES (1, 'admin', '$2b$10$.n0s847tiSxBqDvIo6Vg5ujXC5zIUmm98bTjBWnRdqX9CxxbIo7wS');
INSERT INTO users_roles (user_id, role_id) VALUES (1, 1);
INSERT INTO users (id, username, password) VALUES (2, 'pepe', '$2b$10$.n0s847tiSxBqDvIo6Vg5ujXC5zIUmm98bTjBWnRdqX9CxxbIo7wS');
INSERT INTO users_roles (user_id, role_id) VALUES (2, 2);

/*
 * ==========================================================
 * 9. PROCEDIMIENTOS ALMACENADOS BASE (Stored Procedures)
 * ==========================================================
 */
DELIMITER //

-- --- PROCEDIMIENTOS PARA USERS ---
CREATE PROCEDURE sp_find_user_by_username(IN p_username VARCHAR(50))
BEGIN
  SELECT u.*, r.name as role
  FROM users u
  JOIN users_roles ur ON u.id = ur.user_id
  JOIN roles r ON ur.role_id = r.id
  WHERE u.username = p_username;
END //

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

CREATE PROCEDURE sp_find_all_users()
BEGIN
  SELECT u.id, u.username, r.name as role, u.created_at
  FROM users u
  JOIN users_roles ur ON u.id = ur.user_id
  JOIN roles r ON ur.role_id = r.id;
END //

CREATE PROCEDURE sp_delete_user(IN p_id INT)
BEGIN
  DELETE FROM users WHERE id = p_id;
  SELECT ROW_COUNT() as affectedRows;
END //

-- --- PROCEDIMIENTOS PARA BOOKS ---
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

CREATE PROCEDURE sp_find_books_by_user(IN p_user_id INT)
BEGIN
  SELECT * FROM books WHERE user_id = p_user_id;
END //

CREATE PROCEDURE sp_find_book_by_id(IN p_id INT, IN p_user_id INT)
BEGIN
  SELECT * FROM books WHERE id = p_id AND user_id = p_user_id;
END //

CREATE PROCEDURE sp_delete_book(IN p_id INT, IN p_user_id INT)
BEGIN
  DELETE FROM books WHERE id = p_id AND user_id = p_user_id;
END //

DELIMITER ;

/*
 * ==========================================================
 * REQUERIMIENTO C: MÓDULO DINÁMICO DE CATEGORÍAS
 * ==========================================================
 */
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO categories (name) VALUES ('Ingeniería'), ('Matemática'), ('Programación'), ('Bases de Datos'), ('Redes');

DELIMITER //
CREATE PROCEDURE sp_get_all_categories()
BEGIN
  SELECT id, name FROM categories ORDER BY name ASC;
END //
DELIMITER ;

ALTER TABLE books ADD COLUMN category_id INT;
ALTER TABLE books ADD CONSTRAINT fk_books_categories FOREIGN KEY (category_id) REFERENCES categories(id);

/*
 * ==========================================================
 * REQUERIMIENTO A: STORED PROCEDURE DE EDICIÓN DE METADATOS
 * ==========================================================
 */
DELIMITER //
CREATE PROCEDURE sp_update_book_metadata(
  IN p_book_id INT,
  IN p_user_id INT,
  IN p_title VARCHAR(255),
  IN p_author VARCHAR(255),
  IN p_pages INT,
  IN p_category_id INT
)
BEGIN
  UPDATE books
  SET title = p_title, author = p_author, pages = p_pages, category_id = p_category_id
  WHERE id = p_book_id AND user_id = p_user_id;
END //
DELIMITER ;

/*
 * ==========================================================
 * REQUERIMIENTO B: MÓDULO DE TRAZABILIDAD Y AUDITORÍA
 * ==========================================================
 */
CREATE TABLE IF NOT EXISTS audit_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  action VARCHAR(50) NOT NULL,
  target VARCHAR(255) NOT NULL,
  ip_address VARCHAR(45) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_audit_logs_user_id (user_id),
  INDEX idx_audit_logs_created_at (created_at)
);

DELIMITER //
CREATE PROCEDURE sp_create_audit_log(
  IN p_user_id INT,
  IN p_action VARCHAR(50),
  IN p_target VARCHAR(255),
  IN p_ip_address VARCHAR(45)
)
BEGIN
  INSERT INTO audit_logs (user_id, action, target, ip_address)
  VALUES (p_user_id, p_action, p_target, p_ip_address);
  SELECT LAST_INSERT_ID() as insertId;
END //

CREATE PROCEDURE sp_find_all_audit_logs()
BEGIN
  SELECT a.id, a.user_id, u.username, a.action, a.target, a.ip_address, a.created_at
  FROM audit_logs a
  LEFT JOIN users u ON a.user_id = u.id
  ORDER BY a.created_at DESC, a.id DESC;
END //
DELIMITER ;

-- Reactivar chequeos de claves foráneas al finalizar la inicialización completa
SET foreign_key_checks = 1;