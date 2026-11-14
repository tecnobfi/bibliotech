/*
 * @file delete.sql
 * @brief Script de limpieza o demolición del entorno de base de datos.
 * @project Bibliotech
 * @author Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
 * @license http://www.gnu.org/licenses/gpl.txt GNU GPL 3.0
 * @date Octubre 2026
 */

/*
 * @details Este script es útil para entornos de desarrollo y pruebas (Teardown).
 * La cláusula "IF EXISTS" garantiza la Idempotencia del script: si la base 
 * de datos o el usuario ya fueron borrados, el motor MySQL ignorará la instrucción
 * en lugar de detener la ejecución con un error fatal.
 */

-- Eliminar la base de datos completa
DROP DATABASE IF EXISTS bibliotech;

-- Eliminar el usuario específico de la aplicación
DROP USER IF EXISTS 'bibliotech'@'localhost';

/*
 * @note Confirmación visual: Retornamos un string estático para que el 
 * administrador o el script de Node.js sepa que el proceso terminó con éxito.
 */
SELECT 'Database deleted successfully' AS Status;