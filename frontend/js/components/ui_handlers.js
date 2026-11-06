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
 * @brief Muestra un modal seguro para editar los metadatos de un documento.
 * @param {Object} book Objeto con los datos actuales del libro.
 * @param {Function} onSaveCallback Función a ejecutar cuando el usuario guarde los cambios.
 */
function showEditBookModal(book, onSaveCallback) {
    // 1. Contenedor principal
    const modal = document.createElement('div');
    modal.className = 'w3-modal';
    modal.style.display = 'block';

    // 2. Contenido del modal
    const modalContent = document.createElement('div');
    modalContent.className = 'w3-modal-content w3-card-4 w3-animate-top';
    modalContent.style.maxWidth = '500px';

    // 3. Cabecera
    const header = document.createElement('header');
    header.className = 'w3-container w3-blue';
    
    const closeBtn = document.createElement('span');
    closeBtn.className = 'w3-button w3-display-topright';
    closeBtn.textContent = '×';
    closeBtn.onclick = () => modal.remove();
    
    const title = document.createElement('h2');
    title.textContent = 'Editar Documento';
    
    header.append(title, closeBtn);

    // 4. Cuerpo del formulario
    const body = document.createElement('div');
    body.className = 'w3-container w3-padding';

    // Función auxiliar para no repetir código creando los inputs
    const createInput = (labelText, type, value, id) => {
        const label = document.createElement('label');
        label.textContent = labelText;
        label.className = 'w3-text-blue w3-margin-top';
        label.style.display = 'block';
        
        const input = document.createElement('input');
        input.className = 'w3-input w3-border w3-margin-bottom';
        input.type = type;
        input.value = value;
        input.id = id;
        
        body.append(label, input);
        return input;
    };

    // Creamos los 4 inputs cargados con los datos actuales
    const inputTitle = createInput('Título', 'text', book.title, 'editTitle');
    const inputAuthor = createInput('Autor', 'text', book.author, 'editAuthor');
    const inputCategory = createInput('Categoría', 'text', book.category, 'editCategory');
    const inputPages = createInput('Páginas', 'number', book.pages, 'editPages');

    // 5. Footer con botones
    const footer = document.createElement('footer');
    footer.className = 'w3-container w3-padding w3-light-grey w3-right-align';
    
    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'w3-button w3-red w3-margin-right';
    cancelBtn.textContent = 'Cancelar';
    cancelBtn.onclick = () => modal.remove();

    const saveBtn = document.createElement('button');
    saveBtn.className = 'w3-button w3-green';
    saveBtn.textContent = 'Guardar Cambios';
    
    // Lógica al guardar
    saveBtn.onclick = () => {
        const updatedData = {
            title: inputTitle.value.trim(),
            author: inputAuthor.value.trim(),
            category: inputCategory.value.trim(),
            pages: parseInt(inputPages.value)
        };
        
        onSaveCallback(updatedData); // Ejecutamos la función de actualización
        modal.remove(); // Cerramos el modal
    };

    footer.append(cancelBtn, saveBtn);

    // 6. Ensamblaje final
    modalContent.append(header, body, footer);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
}