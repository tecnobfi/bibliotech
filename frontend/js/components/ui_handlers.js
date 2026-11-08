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

 let editBookSaveHandler = null;

 function appendFormField(form, labelText, control) 
{
    const label = document.createElement('label');
    label.className = 'w3-margin-top w3-show';
    label.textContent = labelText;
    form.append(label, control);
}

function showEditBookModal(book, onSave) 
{
    let modal = document.getElementById('editBookModal');
    editBookSaveHandler = onSave;

    if (!modal) 
    {
        modal = document.createElement('div');
        modal.id = 'editBookModal';
        modal.className = 'w3-modal';

        const content = document.createElement('div');
        content.className = 'w3-modal-content w3-card-4 w3-animate-zoom vault-card';
        content.style.maxWidth = '450px';

        const header = document.createElement('header');
        header.className = 'w3-container w3-border-bottom w3-padding w3-display-container';

        const titleElem = document.createElement('h3');
        titleElem.className = 'w3-margin-0 w3-text-teal';
        titleElem.textContent = 'Editar documento';
        header.appendChild(titleElem);

        const btnCloseHeader = document.createElement('span');
        btnCloseHeader.className = 'w3-button w3-display-topright w3-hover-red';
        btnCloseHeader.textContent = '×';
        btnCloseHeader.style.fontSize = '24px';
        btnCloseHeader.addEventListener('click', () => 
        {
            modal.style.display = 'none';
        });
        header.appendChild(btnCloseHeader);

        const form = document.createElement('form');
        form.id = 'editBookForm';
        form.className = 'w3-container w3-padding';

        const inputTitle = document.createElement('input');
        inputTitle.id = 'editTitle';
        inputTitle.type = 'text';
        inputTitle.required = true;
        inputTitle.className = 'w3-input w3-border w3-round w3-transparent w3-text-white';

        const inputAuthor = document.createElement('input');
        inputAuthor.id = 'editAuthor';
        inputAuthor.type = 'text';
        inputAuthor.required = true;
        inputAuthor.className = 'w3-input w3-border w3-round w3-transparent w3-text-white';

        const selectCategory = document.createElement('select');
        selectCategory.id = 'editCategory';
        selectCategory.className = 'w3-select w3-border w3-round w3-black w3-text-white';

        const inputPages = document.createElement('input');
        inputPages.id = 'editPages';
        inputPages.type = 'number';
        inputPages.min = '1';
        inputPages.required = true;
        inputPages.className = 'w3-input w3-border w3-round w3-transparent w3-text-white';

        // Párrafo reservado para mostrar errores del servidor (ej: 400 de validación) sin cerrar el modal
        const errorElem = document.createElement('p');
        errorElem.id = 'editError';
        errorElem.className = 'w3-text-red';

        const btnCancel = document.createElement('button');
        btnCancel.type = 'button';
        btnCancel.className = 'w3-button w3-dark-grey w3-round w3-margin-right';
        btnCancel.textContent = 'Cancelar';
        btnCancel.addEventListener('click', () => 
        {
            modal.style.display = 'none';
        });

        const btnSave = document.createElement('button');
        btnSave.type = 'submit';
        btnSave.className = 'w3-button w3-teal w3-round';
        btnSave.textContent = 'Guardar cambios';

        const actions = document.createElement('div');
        actions.className = 'w3-margin-top w3-margin-bottom';
        actions.append(btnCancel, btnSave);

        appendFormField(form, 'Título del Documento', inputTitle);
        appendFormField(form, 'Autor', inputAuthor);
        appendFormField(form, 'Categoría', selectCategory);
        appendFormField(form, 'Páginas', inputPages);
        form.append(errorElem, actions);

        // El submit (no el click) permite que la validación nativa 'required' funcione y que Enter envíe el formulario
        form.addEventListener('submit', async (e) => 
        {
            e.preventDefault();
            errorElem.textContent = '';

            const data = {
                title: inputTitle.value,
                author: inputAuthor.value,
                category: selectCategory.value,
                pages: Number(inputPages.value)
            };

            try 
            {
                await editBookSaveHandler(data);
                modal.style.display = 'none';
            } 
            catch (error) 
            {
                errorElem.textContent = error.message;
            }
        });

        content.append(header, form);
        modal.appendChild(content);
        document.body.appendChild(modal);
    }

    // Rellenado con los valores actuales del libro (se ejecuta en cada apertura)
    document.getElementById('editTitle').value = book.title;
    document.getElementById('editAuthor').value = book.author;
    document.getElementById('editPages').value = book.pages;
    document.getElementById('editError').textContent = '';

    /**
     * @note Decisión técnica: Las opciones de categoría se copian del <select id="category"> del formulario de subida 
     * en lugar de duplicarlas a mano acá. Así hay una única fuente de verdad y, cuando el Requerimiento C las cargue 
     * desde la API, este modal las hereda sin cambios.
     */
    const selectEdit = document.getElementById('editCategory');
    const selectSource = document.getElementById('category');
    selectEdit.replaceChildren();

    if (selectSource) 
    {
        Array.from(selectSource.options).forEach(opt => 
        {
            const option = document.createElement('option');
            option.value = opt.value;
            option.textContent = opt.textContent;
            selectEdit.appendChild(option);
        });
    }

    // Si la categoría guardada ya no figura en la lista, se agrega para no perderla silenciosamente al guardar
    const currentCategory = book.category || '';
    const categoryExists = Array.from(selectEdit.options).some(opt => opt.value === currentCategory);

    if (currentCategory && !categoryExists) 
    {
        const option = document.createElement('option');
        option.value = currentCategory;
        option.textContent = currentCategory;
        selectEdit.appendChild(option);
    }

    selectEdit.value = currentCategory;
    modal.style.display = 'block';
}