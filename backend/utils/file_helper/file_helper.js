/**
 * @file file_helper.js
 * @brief Utilidad para la gestión y limpieza física de archivos en el disco.
 * @project Bibliotech
 * @author Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
 * @license http://www.gnu.org/licenses/gpl.txt GNU GPL 3.0
 * @date Octubre 2026
 */

/**
 * @details El módulo nativo 'fs' (File System) permite interactuar con el sistema operativo.
 * En controladores o middlewares donde el proceso de la petición finaliza inmediatamente 
 * tras borrar el archivo, es común utilizar las variantes síncronas (Sync) para evitar 
 * "condiciones de carrera" (Race Conditions) y garantizar la liberación del recurso.
 */
 const fs = require('fs'); 

 /**
  * @details El módulo nativo 'path' resuelve la inconsistencia de los separadores de 
  * directorios entre Windows (\) y sistemas basados en UNIX (/), garantizando portabilidad absoluta.
  */
 const path = require('path'); 
 
 const fileHelper = 
 {
     /**
      * @brief Elimina un archivo del disco duro de forma segura a partir de su ruta relativa.
      * @param {string} relativePath - Ruta parcial guardada en la base de datos (ej: /uploads/doc.pdf).
      * @returns {boolean} True si el archivo fue eliminado con éxito, false en caso contrario.
      */
     deleteFile(relativePath) 
     {
         if (!relativePath) return false;
 
         // Construcción de ruta absoluta concatenando el directorio raíz del proceso de Node.js
         const absolutePath = path.join(process.cwd(), relativePath);
 
         try 
         {
             if (fs.existsSync(absolutePath)) 
             {
                 fs.unlinkSync(absolutePath);
                 console.log(`✅ Archivo eliminado físicamente: ${relativePath}`);
                 return true;
             }
             console.warn(`⚠️ Archivo no encontrado en disco: ${absolutePath}`);
         } 
         catch (err) 
         {
             console.error(`❌ Error al borrar archivo: ${err.message}`);
         }
         return false;
     }
 };
 
 module.exports = fileHelper;