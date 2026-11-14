/**
 * @file i18n.js
 * @brief Gestor centralizado de internacionalización y localización (Traducciones estáticas).
 * @project Bibliotech
 * @author Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
 * @license http://www.gnu.org/licenses/gpl.txt GNU GPL 3.0
 * @date Octubre 2026
 */

 const path = require('path');
 const fs = require('fs');
 
 /**
  * @class I18n
  * @brief Resuelve claves estáticas de diccionarios JSON mapeándolas al idioma activo.
  * @details Implementa el patrón de diseño Singleton. Se garantiza que la aplicación 
  * completa comparta la misma instancia, cargando los diccionarios en memoria (RAM) 
  * una sola vez al encender el servidor, reduciendo a cero el costo de I/O en disco durante las peticiones.
  */
 class I18n 
 {
     constructor() 
     {
         if (I18n._instance) 
         {
             return I18n._instance;
         }
 
         this._language = 'es'; // Idioma base por defecto
         this._resources = {};
         this._localesPath = path.join(__dirname, 'locales');
         
         this._loadLocales();
 
         I18n._instance = this;
     }
 
     /**
      * @brief Carga y parsea todos los archivos .json presentes en la carpeta de idiomas.
      * @private
      */
     _loadLocales() 
     {
         try 
         {
             const files = fs.readdirSync(this._localesPath);
             files.forEach(file => {
                 if (file.endsWith('.json')) 
                 {
                     const langCode = path.basename(file, '.json');
                     const filePath = path.join(this._localesPath, file);
                     const rawData = fs.readFileSync(filePath, 'utf-8');
                     this._resources[langCode] = JSON.parse(rawData);
                 }
             });
         } 
         catch (error) 
         {
             console.error(`❌ Error al cargar recursos de idioma: ${error.message}`);
         }
     }
 
     /**
      * @brief Mutador para cambiar dinámicamente el idioma del sistema.
      * @param {string} lang - Código ISO del idioma (ej: 'en', 'es').
      */
     set language(lang) 
     {
         if (this._resources[lang]) 
         {
             this._language = lang;
         } 
         else 
         {
             console.warn(`⚠️ Idioma '${lang}' no soportado. Se mantiene '${this._language}'.`);
         }
     }
 
     get language() 
     {
         return this._language;
     }
 
     /**
      * @brief Recupera un mensaje de texto traducido a partir de su identificador constante.
      * @param {string} messageName - Clave del diccionario (Convención: Prefijo CT_).
      * @returns {string} Mensaje traducido correspondiente al idioma activo.
      * @throws {Error} Lanza excepción si la clave no existe o el formato es incorrecto.
      */
     getMessage(messageName) 
     {
         try 
         {
             const langDict = this._resources[this._language] || this._resources['es'];
             const message = langDict[messageName];
 
             if (!message) 
             {
                 throw new Error(`La clave '${messageName}' no existe en '${this._language}.json'`);
             }
             return message;
         } 
         catch (e) 
         {
             const fallbackDict = this._resources['es'] || {};
             const fallbackMessage = fallbackDict['CT_INVALID_RESOURCE_CONSTANT'] || "Clave de recurso no encontrada";
             throw new Error(`${fallbackMessage}. Detalles: ${e.message}`);
         }
     }
 }
 
 // Congelamos el objeto para evitar mutaciones accidentales del patrón Singleton.
 const instance = new I18n();
 Object.freeze(instance);
 
 module.exports = instance;