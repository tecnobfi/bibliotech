/**
 * @file audit_front_controller.js
 * @brief Controlador frontend para la visualización del historial de auditoría.
 * @project Bibliotech
 * @author Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
 * @license http://www.gnu.org/licenses/gpl.txt GNU GPL 3.0
 * @date Noviembre 2026
 */

 /**
  * @brief Traducción de los códigos técnicos de acción a texto legible y su color de etiqueta.
  * @details Los códigos (DELETE_BOOK, DELETE_USER) son los mismos que define
  * auditController.ACTIONS en el backend. Si llega un código desconocido se muestra tal cual.
  */
 const AUDIT_ACTION_LABELS = Object.freeze({
     DELETE_BOOK: { text: 'Eliminó un documento', css: 'w3-tag w3-orange' },
     DELETE_USER: { text: 'Eliminó un usuario', css: 'w3-tag w3-red' }
 });

 document.addEventListener('DOMContentLoaded', () =>
 {
     document.getElementById('btnRefreshLogs').addEventListener('click', loadAuditLogs);
     loadAuditLogs();
 });

 /**
  * @brief Solicita al servidor el historial de auditoría y delega la renderización.
  * @note Si el usuario no es administrador, el backend responde 403 (isAdmin) y
  * apiService lanza la excepción: se informa y se redirige al login, igual que en
  * admin_front_controller.
  */
 async function loadAuditLogs()
 {
     try
     {
         const logs = await apiService.request('/audit/logs', 'GET');
         renderAuditTable(logs);
     }
     catch (error)
     {
         showModal('Acceso denegado', error.message);
         window.location.href = '/login';
     }
 }

 /**
  * @brief Crea una celda de tabla con texto plano.
  * @param {string} text - Contenido de la celda.
  * @returns {HTMLTableCellElement} Nodo <td> listo para insertar.
  * @note Usamos textContent (nunca innerHTML): aunque un campo como 'target' contuviera
  * etiquetas HTML maliciosas, el navegador las mostraría como texto y no las ejecutaría (XSS).
  */
 function createTextCell(text)
 {
     const td = document.createElement('td');
     td.textContent = text;
     return td;
 }

 /**
  * @brief Renderización segura del historial creando nodos DOM fila por fila.
  * @param {Array} logs - Lista de eventos retornada por GET /api/audit/logs.
  */
 function renderAuditTable(logs)
 {
     const tbody = document.getElementById('auditTableBody');
     tbody.replaceChildren();

     // Estado vacío: una única fila que ocupa todas las columnas
     if (logs.length === 0)
     {
         const row = document.createElement('tr');
         const td = createTextCell('Todavía no hay eventos registrados.');
         td.colSpan = 5;
         td.className = 'w3-center w3-opacity';
         row.appendChild(td);
         tbody.appendChild(row);
         return;
     }

     logs.forEach(log =>
     {
         const row = document.createElement('tr');

         const tdDate = createTextCell(new Date(log.created_at).toLocaleString('es-AR'));

         // Si el usuario fue eliminado, el SP (LEFT JOIN) devuelve username = null.
         // Conservamos su ID para que el registro siga siendo útil para el análisis forense.
         const tdUser = document.createElement('td');
         if (log.username)
         {
             const boldUser = document.createElement('b');
             boldUser.textContent = log.username;
             tdUser.appendChild(boldUser);
         }
         else
         {
             const italicUser = document.createElement('i');
             italicUser.className = 'w3-opacity';
             italicUser.textContent = `Usuario eliminado (ID ${log.user_id})`;
             tdUser.appendChild(italicUser);
         }

         const tdAction = document.createElement('td');
         const spanAction = document.createElement('span');
         const label = AUDIT_ACTION_LABELS[log.action];
         spanAction.className = label ? label.css : 'w3-tag w3-grey';
         spanAction.textContent = label ? label.text : log.action;
         tdAction.appendChild(spanAction);

         const tdTarget = createTextCell(log.target);
         const tdIp = createTextCell(log.ip_address || '-');

         row.append(tdDate, tdUser, tdAction, tdTarget, tdIp);
         tbody.appendChild(row);
     });
 }
