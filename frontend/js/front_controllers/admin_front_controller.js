/**
 * @file admin_front_controller.js
 * @brief Controlador frontend para la visualización y administración de usuarios del sistema.
 * @project Bibliotech
 * @author Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
 * @license http://www.gnu.org/licenses/gpl.txt GNU GPL 3.0
 * @date Octubre 2026
 */

 document.addEventListener('DOMContentLoaded', loadUsers);

 /**
  * @brief Solicita al servidor el listado de usuarios y delega la renderización.
  */
 async function loadUsers() 
 {
     try 
     {
         const users = await apiService.request('/admin/users', 'GET');
         renderUsersTable(users);
     } 
     catch (error) 
     {
         showModal('Acceso denegado', error.message);
         window.location.href = '/login';
     }
 }
 
 /**
  * @brief Renderización segura de usuarios iterando sobre el array y creando nodos DOM.
  * @param {Array} users - Lista de objetos de usuario retornada por la API.
  */
 function renderUsersTable(users) 
 {
     const tbody = document.getElementById('usersTableBody');
     
     // replaceChildren() es el método moderno y más rápido para vaciar un contenedor DOM, 
     // reemplazando el inseguro tbody.innerHTML = ''
     tbody.replaceChildren();
 
     users.forEach(u => 
     {
         const row = document.createElement('tr');
 
         const tdId = document.createElement('td');
         tdId.textContent = u.id;
 
         const tdUser = document.createElement('td');
         const boldUser = document.createElement('b');
         boldUser.textContent = u.username;
         tdUser.appendChild(boldUser);
 
         const tdRole = document.createElement('td');
         const spanRole = document.createElement('span');
         spanRole.className = u.role === 'admin' ? "w3-tag w3-teal" : "w3-tag w3-blue";
         spanRole.textContent = u.role;
         tdRole.appendChild(spanRole);
 
         const tdDate = document.createElement('td');
         tdDate.textContent = new Date(u.created_at).toLocaleDateString();
 
         const tdActions = document.createElement('td');
         const btnDelete = document.createElement('button');
         btnDelete.className = "w3-button w3-red w3-tiny";
         btnDelete.textContent = "Eliminar usuario y sus PDFs";
         btnDelete.addEventListener('click', () => 
         {
             deleteUser(u.id);
         });
         tdActions.appendChild(btnDelete);
 
         // Ensamblaje final de la fila
         row.append(tdId, tdUser, tdRole, tdDate, tdActions);
         tbody.appendChild(row);
     });
 }
 
 /**
  * @brief Solicita la eliminación de un usuario tras confirmación manual.
  * @param {number} id - Identificador del usuario.
  */
 async function deleteUser(id) 
 {
     if (!confirm('¿Estás seguro de eliminar a este usuario? Se borrarán todos sus PDFs permanentemente.')) 
     {
         return;
     }
 
     try 
     {
         await apiService.request(`/admin/users/${id}`, 'DELETE');
         showModal('Éxito', 'Usuario y archivos eliminados con éxito');
         loadUsers(); 
     } 
     catch (error) 
     {
         showModal('Error al eliminar usuario', error.message);
     }
 }