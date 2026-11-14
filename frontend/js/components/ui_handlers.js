/**
 * @file ui_handlers.js
 * @brief Componentes de interfaz gráfica dinámica construidos en memoria (Zero innerHTML).
 * @project Bibliotech
 * @author Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
 * @license http://www.gnu.org/licenses/gpl.txt GNU GPL 3.0
 * @date Octubre 2026
 */

/**
 * @brief Construye y muestra una ventana de diálogo modal informativa.
 * @details Manipulación estricta del DOM: Al usar document.createElement() y textContent, 
 * blindamos la aplicación contra inyección de código (XSS). El texto se renderiza como 
 * dato puro, nunca como HTML ejecutable.
 * @param {string} title - Título del cuadro de diálogo.
 * @param {string} message - Mensaje o cuerpo de la alerta.
 */
 function showModal(title, message) 
 {
     let modal = document.getElementById('msgModal');
 
     // Patrón Singleton aplicado al DOM: Solo creamos los elementos si no existen previamente
     if (!modal) 
     {
         modal = document.createElement('div');
         modal.id = 'msgModal';
         modal.className = 'w3-modal';
 
         const content = document.createElement('div');
         content.className = 'w3-modal-content w3-card-4 w3-animate-zoom vault-card';
         content.style.maxWidth = '400px';
 
         const header = document.createElement('header');
         header.className = 'w3-container w3-border-bottom';
 
         const titleElem = document.createElement('h3');
         titleElem.id = 'modalTitle';
         header.appendChild(titleElem);
 
         const bodyDiv = document.createElement('div');
         bodyDiv.className = 'w3-container w3-padding';
 
         const msgElem = document.createElement('p');
         msgElem.id = 'modalBody';
         
         const btnClose = document.createElement('button');
         btnClose.className = 'w3-button w3-right w3-teal w3-margin-bottom'; 
         btnClose.textContent = 'Cerrar';
         
         // Asignación de eventos mediante Listeners (más limpio que usar el atributo onclick en HTML)
         btnClose.addEventListener('click', () => 
         {
             modal.style.display = 'none';
         });
 
         // Ensamblaje del árbol DOM: De adentro hacia afuera
         bodyDiv.appendChild(msgElem);
         bodyDiv.appendChild(btnClose);
         content.appendChild(header);
         content.appendChild(bodyDiv);
         modal.appendChild(content);
         document.body.appendChild(modal);
     }
 
     // Actualizamos el contenido dinámico reutilizando los nodos existentes
     document.getElementById('modalTitle').textContent = title;
     document.getElementById('modalBody').textContent = message;
     modal.style.display = 'block';
 }
 
 /**
  * @brief Muestra una ventana modal conteniendo un visor de PDF interactivo.
  * @param {string} title - Título del documento.
  * @param {string} pdfUrl - Ruta física del archivo en el servidor.
  */
 function showPdfModal(title, pdfUrl) 
 {
     let modal = document.getElementById('pdfModal');
 
     if (!modal) 
     {
         modal = document.createElement('div');
         modal.id = 'pdfModal';
         modal.className = 'w3-modal';
         modal.style.zIndex = '9999';
 
         const content = document.createElement('div');
         content.className = 'w3-modal-content w3-card-4 w3-animate-zoom vault-card';
         content.style.width = '85%';
         content.style.maxWidth = '950px';
 
         const header = document.createElement('header');
         header.className = 'w3-container w3-border-bottom w3-padding w3-display-container';
 
         const titleElem = document.createElement('h3');
         titleElem.id = 'pdfModalTitle';
         titleElem.className = 'w3-margin-0 w3-text-teal';
         header.appendChild(titleElem);
 
         // Botón de cerrar posicionado absolutamente. 
         // Zero-innerHTML: Usamos el carácter Unicode '×' nativo en textContent.
         const btnCloseHeader = document.createElement('span');
         btnCloseHeader.className = 'w3-button w3-display-topright w3-hover-red';
         btnCloseHeader.textContent = '×'; 
         btnCloseHeader.style.fontSize = '24px';
         btnCloseHeader.addEventListener('click', () => 
         {
             modal.style.display = 'none';
             const iframe = document.getElementById('pdfIframe');
             // Al vaciar el src, detenemos la descarga en segundo plano del PDF
             if (iframe) 
             {
                 iframe.src = '';
             }
         });
         header.appendChild(btnCloseHeader);
 
         const bodyDiv = document.createElement('div');
         bodyDiv.className = 'w3-container w3-padding-0';
 
         const iframe = document.createElement('iframe');
         iframe.id = 'pdfIframe';
         iframe.style.width = '100%';
         iframe.style.height = '75vh';
         iframe.style.border = 'none';
         
         bodyDiv.appendChild(iframe);
         content.appendChild(header);
         content.appendChild(bodyDiv);
         modal.appendChild(content);
         document.body.appendChild(modal);
     }
 
     document.getElementById('pdfModalTitle').textContent = title;
     document.getElementById('pdfIframe').src = pdfUrl;
     modal.style.display = 'block';
 }
 /**
 * @brief Muestra una ventana modal para editar los metadatos de un documento.
 * @details Manipulación estricta del DOM mediante document.createElement() y textContent (Zero innerHTML).
 * @param {Object} book Objeto con los datos actuales del libro (id, title, author, pages, category).
 * @param {Function} onSaveCallback Función callback que se ejecuta al enviar el formulario con los nuevos datos.
 */
function showEditMetadataModal(book, onSaveCallback) 
{
    let modal = document.getElementById('editMetadataModal');

    // Patrón Singleton aplicado al DOM: Solo creamos los elementos si no existen previamente
    if (!modal) 
    {
        modal = document.createElement('div');
        modal.id = 'editMetadataModal';
        modal.className = 'w3-modal';
        modal.style.zIndex = '9999';

        const content = document.createElement('div');
        content.className = 'w3-modal-content w3-card-4 w3-animate-zoom vault-card';
        content.style.maxWidth = '450px';

        const header = document.createElement('header');
        header.className = 'w3-container w3-border-bottom w3-padding w3-display-container';

        const titleElem = document.createElement('h3');
        titleElem.id = 'editModalTitle';
        titleElem.className = 'w3-margin-0 w3-text-teal';
        titleElem.textContent = 'Editar Metadatos del Libro';
        header.appendChild(titleElem);

        // Botón de cerrar (Cruz superior derecha)
        const btnCloseHeader = document.createElement('span');
        btnCloseHeader.className = 'w3-button w3-display-topright w3-hover-red';
        btnCloseHeader.textContent = '×';
        btnCloseHeader.style.fontSize = '24px';
        btnCloseHeader.addEventListener('click', () => 
        {
            modal.style.display = 'none';
        });
        header.appendChild(btnCloseHeader);

        const bodyDiv = document.createElement('div');
        bodyDiv.className = 'w3-container w3-padding';

        // Formulario de edición
        const form = document.createElement('form');
        form.id = 'editMetadataForm';

        // Helper para crear campos de texto estructurados de forma segura
        function createField(labelText, inputId, inputType, value) {
            const wrapper = document.createElement('div');
            wrapper.className = 'w3-margin-bottom';

            const label = document.createElement('label');
            label.className = 'w3-text-dark-gray';
            label.textContent = labelText;

            const input = document.createElement('input');
            input.type = inputType;
            input.id = inputId;
            input.className = 'w3-input w3-border w3-round';
            input.value = value || '';
            input.required = true;

            wrapper.appendChild(label);
            wrapper.appendChild(input);
            return wrapper;
        }

        const inputTitle = createField('Título:', 'editTitle', 'text', book.title);
        const inputAuthor = createField('Autor:', 'editAuthor', 'text', book.author);
        const inputPages = createField('Páginas:', 'editPages', 'number', book.pages);
        const inputCategory = createField('Categoría:', 'editCategory', 'text', book.category);

        // Contenedor de botones de acción
        const btnContainer = document.createElement('div');
        btnContainer.className = 'w3-section w3-right-align';

        const btnCancel = document.createElement('button');
        btnCancel.type = 'button';
        btnCancel.className = 'w3-button w3-light-grey w3-margin-right w3-round';
        btnCancel.textContent = 'Cancelar';
        btnCancel.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        const btnSubmit = document.createElement('button');
        btnSubmit.type = 'submit';
        btnSubmit.className = 'w3-button w3-teal w3-round';
        btnSubmit.textContent = 'Guardar Cambios';

        btnContainer.appendChild(btnCancel);
        btnContainer.appendChild(btnSubmit);

        form.appendChild(inputTitle);
        form.appendChild(inputAuthor);
        form.appendChild(inputPages);
        form.appendChild(inputCategory);
        form.appendChild(btnContainer);

        // Manejo del evento Submit del formulario
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const updatedData = {
                title: document.getElementById('editTitle').value,
                author: document.getElementById('editAuthor').value,
                pages: parseInt(document.getElementById('editPages').value, 10),
                category: document.getElementById('editCategory').value
            };
            onSaveCallback(book.id, updatedData, modal);
        });

        bodyDiv.appendChild(form);
        content.appendChild(header);
        content.appendChild(bodyDiv);
        modal.appendChild(content);
        document.body.appendChild(modal);
    } 
    else 
    {
        // Si el modal ya existe en el DOM, actualizamos los valores de los inputs con el libro seleccionado
        document.getElementById('editTitle').value = book.title || '';
        document.getElementById('editAuthor').value = book.author || '';
        document.getElementById('editPages').value = book.pages || '';
        document.getElementById('editCategory').value = book.category || '';
        
        // Reasignamos el evento submit para que apunte al libro actual
        const form = document.getElementById('editMetadataForm');
        // Clonar y reemplazar el formulario limpia los listeners viejos de forma segura
        const newForm = form.cloneNode(true);
        form.parentNode.replaceChild(newForm, form);

        newForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const updatedData = {
                title: document.getElementById('editTitle').value,
                author: document.getElementById('editAuthor').value,
                pages: parseInt(document.getElementById('editPages').value, 10),
                category: document.getElementById('editCategory').value
            };
            onSaveCallback(book.id, updatedData, modal);
        });

        // Reasignar evento al botón cancelar dentro del modal existente
        newForm.querySelectorAll('button')[0].addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    modal.style.display = 'block';
}