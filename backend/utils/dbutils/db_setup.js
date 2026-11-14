/**
 * @file db_setup.js
 * @brief Script de inicialización automatizada (Bootstrap) de la base de datos usando DDL.
 * @project Bibliotech
 * @author Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
 * @license http://www.gnu.org/licenses/gpl.txt GNU GPL 3.0
 * @date Octubre 2026
 */

 require('dotenv').config();
 const mysql = require('mysql2/promise');
 const fs = require('fs');
 const path = require('path');
 
 /**
  * @brief Lee el archivo init.sql, lo parsea y lo ejecuta de forma nativa contra el motor MySQL.
  * @details Este script es altamente pedagógico ya que enseña cómo automatizar la preparación 
  * de entornos (Infrastructure as Code) sin depender de herramientas gráficas como phpMyAdmin.
  */
 async function run() {
     console.log("=================================================");
     console.log("⚡ Creando e Inicializando Base de Datos...");
     console.log("=================================================");
 
     const host = process.env.DB_HOST || 'localhost';
     const rootUser = 'root'; 
     const rootPass = ''; // Por defecto en servidores de desarrollo (XAMPP, Laragon, etc.)
 
     let connection;
     try {
         // Conectar como root para poder crear la DB y otorgar permisos
         connection = await mysql.createConnection({
             host: host,
             user: rootUser,
             password: rootPass,
             multipleStatements: true // Habilitar múltiples consultas en una sola llamada
         });
         
         const sqlPath = path.join(__dirname, '../config/init.sql');
         const sqlContent = fs.readFileSync(sqlPath, 'utf8');
 
         console.log("📂 Leyendo init.sql y limpiando sintaxis del cliente (DELIMITER)...");
 
         // El comando DELIMITER es una instrucción específica del cliente CLI de MySQL (como phpMyAdmin)
         // y arroja error de sintaxis cuando se envía directamente a través de drivers de programación.
         // Aquí lo limpiamos y convertimos las barras '//' en ';' para que sea compatible con el servidor.
         const sqlClean = sqlContent
             .replace(/DELIMITER\s+\/\/+/gi, '')
             .replace(/DELIMITER\s+;+/gi, '')
             .replace(/\/\//g, ';');
 
         await connection.query(sqlClean);
         console.log("✅ Base de datos 'bibliotech' creada y configurada exitosamente.");
         console.log("✅ Usuario de base de datos 'bibliotech' configurado.");
     } catch (error) {
         console.error("❌ Error al configurar la base de datos:");
         console.error(error.message);
         console.log("\n👉 Intenta importar manualmente el archivo 'backend/config/init.sql' desde phpMyAdmin o MySQL Workbench.");
     } finally {
         if (connection) {
             await connection.end();
         }
     }
 }
 
 run();