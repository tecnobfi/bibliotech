/**
 * @file auth_front_controller.js
 * @brief Controlador frontend para gestionar el inicio de sesión y registro de usuarios.
 * @project Bibliotech
 * @author Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
 * @license http://www.gnu.org/licenses/gpl.txt GNU GPL 3.0
 * @date Octubre 2026
 */

 const loginForm = document.getElementById('loginForm');

 if (loginForm) 
 {
     loginForm.addEventListener('submit', async (e) => 
     {
         // preventDefault detiene el comportamiento nativo de HTML que recarga la página al enviar un formulario
         e.preventDefault(); 
 
         const username = document.getElementById('username').value;
         const password = document.getElementById('password').value;
 
         try 
         {
             const data = await apiService.request('/auth/login', 'POST', { username, password });
             
             authHelper.saveSession(data.token, data.role);
 
             // Redirección dinámica basada en el rol (Authoritative Routing)
             if (data.role === 'admin') 
             {
                 window.location.href = '/admin_dashboard';
                 return; // Early return para detener la ejecución
             }
             
             window.location.href = '/client_dashboard';
         } 
         catch (error) 
         {
             showModal('Error de Acceso', error.message);
         }
     });
 }
 
 const registerForm = document.getElementById('registerForm');
 
 if (registerForm) 
 {
     registerForm.addEventListener('submit', async (e) => 
     {
         e.preventDefault();
         const username = document.getElementById('username').value;
         const password = document.getElementById('password').value;
 
         try 
         {
             await apiService.request('/auth/register', 'POST', { username, password });
             showModal('¡Éxito!', 'Usuario creado. Ahora puedes iniciar sesión.');
             
             // Retraso de navegación para permitir que el usuario lea el modal
             setTimeout(() => 
             { 
                 window.location.href = '/login'; 
             }, 2000);
         } 
         catch (error) 
         {
             showModal('Error de Registro', error.message);
         }
     });
 }