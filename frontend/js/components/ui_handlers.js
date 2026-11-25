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
 * Despliega un modal interactivo construido 100% mediante manipulaciones del DOM nativo.
 *
 * @param {Object} book Datos del libro a editar
 */
function openEditModal(book) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';

    const modalBox = document.createElement('div');
    modalBox.className = 'modal-box';

    const titleHeader = document.createElement('h3');
    titleHeader.textContent = 'Editar Metadatos del Libro';

    // Campo Título
    const labelTitle = document.createElement('label');
    labelTitle.textContent = 'Título:';

    const inputTitle = document.createElement('input');
    inputTitle.type = 'text';
    inputTitle.value = book.displayname || book.title || '';

    // Campo Autor
    const labelAuthor = document.createElement('label');
    labelAuthor.textContent = 'Autor:';

    const inputAuthor = document.createElement('input');
    inputAuthor.type = 'text';
    inputAuthor.value = book.author || '';

    // Campo Páginas
    const labelPages = document.createElement('label');
    labelPages.textContent = 'Páginas:';

    const inputPages = document.createElement('input');
    inputPages.type = 'number';
    inputPages.value = book.pages || 0;

    // Botones de Acción
    const btnSave = document.createElement('button');
    btnSave.textContent = 'Guardar Cambios';
    btnSave.className = 'btn-success';

    const btnCancel = document.createElement('button');
    btnCancel.textContent = 'Cancelar';
    btnCancel.className = 'btn-secondary';

    btnCancel.addEventListener('click', () => {
        overlay.remove();
    });

    btnSave.addEventListener('click', async () => {
        try {
            const categorySelect = document.getElementById('category');

            const selectedCategory = categorySelect
                ? parseInt(categorySelect.value)
                : book.category_id;

            const updatedData = {
                title: inputTitle.value,
                author: inputAuthor.value,
                pages: parseInt(inputPages.value),
                categoryId: selectedCategory
            };

            await apiService.request(
                `/books/${book.id}`,
                'PUT',
                updatedData
            );

            overlay.remove();
            window.location.reload();

        } catch (err) {
            alert('Error al guardar cambios: ' + err.message);
        }
    });

    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'modal-buttons';
    buttonGroup.replaceChildren(btnSave, btnCancel);

    modalBox.replaceChildren(
        titleHeader,
        labelTitle,
        inputTitle,
        labelAuthor,
        inputAuthor,
        labelPages,
        inputPages,
        buttonGroup
    );

    overlay.appendChild(modalBox);
    document.body.appendChild(overlay);
}