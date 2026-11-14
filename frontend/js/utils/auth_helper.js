/**
 * @file auth_helper.js
 * @brief Utilidades auxiliares para el almacenamiento y ciclo de vida de la sesión local.
 * @project Bibliotech
 * @author Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
 * @license http://www.gnu.org/licenses/gpl.txt GNU GPL 3.0
 * @date Octubre 2026
 */

 const authHelper = 
 {
     /**
      * @brief Almacenamiento configurable (localStorage = persiste tras cerrar el navegador).
      * Se puede cambiar a sessionStorage si se desea destruir la sesión al cerrar la pestaña.
      */
     storage: localStorage,
 
     saveSession(token, role) 
     {
         this.storage.setItem('token', token);
         this.storage.setItem('role', role);
     },
 
     getToken() 
     {
         return this.storage.getItem('token');
     },
 
     getRole() 
     {
         return this.storage.getItem('role');
     },
 
     /**
      * @brief Destruye las credenciales locales y redirige a la pantalla pública.
      */
     logout() 
     {
         this.storage.clear();
         window.location.href = '/login';
     },
 
     /**
      * @brief Busca todos los botones con la clase '.btn-logout' y les asigna el evento de salida.
      */
     initLogoutButtons() 
     {
         const logoutBtns = document.querySelectorAll('.btn-logout');
         logoutBtns.forEach(btn => 
         {
             btn.addEventListener('click', () => 
             {
                 this.logout();
             });
         });
     }
 };
 
 // Se asegura de que el DOM esté completamente cargado antes de enlazar los botones
 document.addEventListener('DOMContentLoaded', () => 
 {
     authHelper.initLogoutButtons();
 });