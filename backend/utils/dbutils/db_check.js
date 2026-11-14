/**
 * @file db_check.js
 * @brief Script de diagnóstico CLI para comprobar la conectividad y estado de la base de datos.
 * @project Bibliotech
 * @author Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
 * @license http://www.gnu.org/licenses/gpl.txt GNU GPL 3.0
 * @date Octubre 2026
 */

 require('dotenv').config();
 const mysql = require('mysql2/promise');
 
 /**
  * @brief Ejecuta una batería de pruebas de conexión progresivas para facilitar la depuración 
  * de credenciales durante el despliegue del proyecto por parte de los estudiantes.
  */
 async function test() {
     console.log("=================================================");
     console.log("🔍 DIAGNÓSTICO DE BASE DE DATOS");
     console.log("=================================================");
     
     console.log("Configuración del .env:");
     console.log(`- HOST: ${process.env.DB_HOST}`);
     console.log(`- USER: ${process.env.DB_USER}`);
     console.log(`- PASS: ${process.env.DB_PASS ? '****' : '(vacío)'}`);
     console.log(`- NAME: ${process.env.DB_NAME}`);
     console.log("-------------------------------------------------");
 
     try {
         // Intentar conectar con las credenciales de la aplicación
         const connection = await mysql.createConnection({
             host: process.env.DB_HOST || 'localhost',
             user: process.env.DB_USER,
             password: process.env.DB_PASS,
             database: process.env.DB_NAME
         });
         console.log("✅ CONEXIÓN EXITOSA: La aplicación se puede conectar usando el archivo .env!");
 
         const [users] = await connection.query("SELECT id, username FROM users");
         console.log("👥 Usuarios encontrados en la tabla:", users);
 
         const [roles] = await connection.query("SELECT * FROM roles");
         console.log("🔑 Roles cargados:", roles);
 
         await connection.end();
     } catch (err) {
         console.error("❌ ERROR CON CREDENCIALES DEL .ENV:", err.message);
         
         console.log("\nProbando diagnóstico alternativo con usuario 'root' (sin contraseña)...");
         try {
             const rootConnection = await mysql.createConnection({
                 host: process.env.DB_HOST || 'localhost',
                 user: 'root',
                 password: ''
             });
             console.log("✅ CONEXIÓN COMO ROOT EXITOSA!");
             
             const [dbRows] = await rootConnection.query("SHOW DATABASES LIKE 'bibliotech'");
             if (dbRows.length === 0) {
                 console.log("❌ La base de datos 'bibliotech' NO existe. Debes correr 'node utils/setupDb.js'.");
             } else {
                 console.log("✅ La base de datos 'bibliotech' existe.");
                 await rootConnection.query("USE bibliotech");
                 try {
                     const [userRows] = await rootConnection.query("SELECT id, username FROM users");
                     console.log("👥 Usuarios en 'bibliotech':", userRows);
                 } catch (dbErr) {
                     console.log("❌ La base de datos existe pero la tabla 'users' no se creó correctamente:", dbErr.message);
                 }
             }
             await rootConnection.end();
         } catch (rootErr) {
             console.error("❌ Falló la conexión alternativa como root:", rootErr.message);
             console.log("\n👉 Por favor, asegúrate de que MySQL esté activo en tu equipo.");
         }
     }
 }
 
 test();