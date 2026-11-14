/**
 * @file api_service.js
 * @brief Cliente de API centralizado para gestionar peticiones HTTP asíncronas.
 * @project Bibliotech
 * @author Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
 * @license http://www.gnu.org/licenses/gpl.txt GNU GPL 3.0
 * @date Octubre 2026
 */

 const API_URL = "/api";

 /**
  * @class apiService
  * @brief Patrón Interceptor: Centraliza la lógica de peticiones Fetch para inyectar 
  * automáticamente el token JWT en las cabeceras de todas las llamadas.
  */
 const apiService = 
 {
     /**
      * @brief Ejecuta una petición HTTP contra el servidor backend.
      * @param {string} endpoint - Ruta relativa de la API (ej: /auth/login).
      * @param {string} method - Verbo HTTP (GET, POST, DELETE, etc.).
      * @param {Object|FormData} data - Carga útil (Payload) a enviar.
      * @param {boolean} isFormData - Bandera para indicar si es envío de archivos (multipart).
      * @returns {Promise<Object>} Promesa que resuelve en el JSON parseado de la respuesta.
      */
     async request(endpoint, method = 'GET', data = null, isFormData = false) 
     {
         const token = authHelper.getToken();
         
         const headers = {};
         
         // Si usamos FormData (subida de archivos), el navegador debe establecer 
         // automáticamente el Content-Type junto con el 'boundary' multipart.
         if (!isFormData) 
         {
             headers['Content-Type'] = 'application/json';
         }
 
         // Si existe sesión activa, inyectamos la credencial de autorización
         if (token) 
         {
             /**
              * @see https://share.google/aimode/W0GFxeVPzWMgWphxw
              * Un Bearer Token (o "token de portador") es un tipo de credencial 
              * de seguridad de OAuth 2.0 que otorga acceso a recursos protegidos 
              * de una API a cualquier entidad que lo posea.
              * Según la documentación oficial de MDN Web Docs sobre Autenticación HTTP, 
              * el esquema Bearer está definido en el RFC 6750.
              */
             headers['Authorization'] = `Bearer ${token}`;
         }
 
         const config = { method, headers };
         
         if (data) 
         {
             config.body = isFormData ? data : JSON.stringify(data);
         }
 
         // Fetch API: El estándar moderno de JavaScript para peticiones de red
         const response = await fetch(`${API_URL}${endpoint}`, config);
         const result = await response.json();
 
         // Control Centralizado de Expiración de Sesión (Cierre automático)
         if (response.status === 401) 
         {
             authHelper.logout();
         }
 
         // Validamos si la petición fue exitosa (Códigos HTTP 200-299)
         if (!response.ok) 
         {
             throw new Error(result.message || 'Error en la petición');
         }
         
         return result;
     }
 };