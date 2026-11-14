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
        
        // Asignación de eventos mediante Listeners
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
 * @brief Ventana modal interactiva para registrar una nueva categoría.
 * @param {Function} onSubmit - Función asíncrona que recibe el nombre de la categoría a crear.
 */
function showCreateCategoryModal(onSubmit) 
{
    let modal = document.getElementById('createCategoryModal');

    if (!modal) 
    {
        modal = document.createElement('div');
        modal.id = 'createCategoryModal';
        modal.className = 'w3-modal';

        const content = document.createElement('div');
        content.className = 'w3-modal-content w3-card-4 w3-animate-zoom vault-card';
        content.style.maxWidth = '450px';

        const header = document.createElement('header');
        header.className = 'w3-container w3-border-bottom w3-display-container';

        const titleElem = document.createElement('h3');
        titleElem.className = 'w3-text-teal';
        titleElem.textContent = 'Nueva Categoría';
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
        form.id = 'formNewCategoryModal';
        form.className = 'w3-container w3-padding-16';

        const label = document.createElement('label');
        label.textContent = 'Nombre de la Categoría:';

        const input = document.createElement('input');
        input.id = 'newCategoryModalInput';
        input.type = 'text';
        input.className = 'w3-input w3-border w3-round w3-transparent w3-text-white w3-margin-top';
        input.placeholder = 'Ej: Filosofía, Ciencia...';
        input.required = true;

        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'w3-margin-top w3-right-align';

        const btnCancel = document.createElement('button');
        btnCancel.type = 'button';
        btnCancel.className = 'w3-button w3-dark-grey w3-round w3-margin-right';
        btnCancel.textContent = 'Cancelar';
        btnCancel.addEventListener('click', () => 
        {
            modal.style.display = 'none';
        });

        const btnSubmit = document.createElement('button');
        btnSubmit.type = 'submit';
        btnSubmit.className = 'w3-button w3-teal w3-round';
        btnSubmit.textContent = 'Guardar';

        actionsDiv.appendChild(btnCancel);
        actionsDiv.appendChild(btnSubmit);

        form.appendChild(label);
        form.appendChild(input);
        form.appendChild(actionsDiv);

        content.appendChild(header);
        content.appendChild(form);
        modal.appendChild(content);
        document.body.appendChild(modal);

        form.addEventListener('submit', async (e) => 
        {
            e.preventDefault();
            const val = input.value.trim();
            if (val.length === 0) 
            {
                return;
            }
            if (modal._submitHandler) 
            {
                await modal._submitHandler(val);
            }
        });
    }

    modal._submitHandler = onSubmit;
    const inputField = document.getElementById('newCategoryModalInput');
    inputField.value = '';
    modal.style.display = 'block';
    setTimeout(() => inputField.focus(), 50);
}

/**
 * @brief Ventana modal interactiva para seleccionar y eliminar una categoría.
 * @param {Array<Object>} categories - Lista de objetos de categorías { id, name }.
 * @param {Function} onSubmit - Función asíncrona que recibe el ID de la categoría a eliminar.
 */
function showDeleteCategoryModal(categories, onSubmit) 
{
    let modal = document.getElementById('deleteCategoryModal');

    if (!modal) 
    {
        modal = document.createElement('div');
        modal.id = 'deleteCategoryModal';
        modal.className = 'w3-modal';

        const content = document.createElement('div');
        content.className = 'w3-modal-content w3-card-4 w3-animate-zoom vault-card';
        content.style.maxWidth = '450px';

        const header = document.createElement('header');
        header.className = 'w3-container w3-border-bottom w3-display-container';

        const titleElem = document.createElement('h3');
        titleElem.className = 'w3-text-red';
        titleElem.textContent = 'Eliminar Categoría';
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
        form.id = 'formDeleteCategoryModal';
        form.className = 'w3-container w3-padding-16';

        const label = document.createElement('label');
        label.textContent = 'Seleccione la categoría a eliminar:';

        const select = document.createElement('select');
        select.id = 'deleteCategoryModalSelect';
        select.className = 'w3-select w3-border w3-round w3-black w3-text-white w3-margin-top';
        select.required = true;

        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'w3-margin-top w3-right-align';

        const btnCancel = document.createElement('button');
        btnCancel.type = 'button';
        btnCancel.className = 'w3-button w3-dark-grey w3-round w3-margin-right';
        btnCancel.textContent = 'Cancelar';
        btnCancel.addEventListener('click', () => 
        {
            modal.style.display = 'none';
        });

        const btnSubmit = document.createElement('button');
        btnSubmit.type = 'submit';
        btnSubmit.className = 'w3-button w3-red w3-round';
        btnSubmit.textContent = 'Eliminar';

        actionsDiv.appendChild(btnCancel);
        actionsDiv.appendChild(btnSubmit);

        form.appendChild(label);
        form.appendChild(select);
        form.appendChild(actionsDiv);

        content.appendChild(header);
        content.appendChild(form);
        modal.appendChild(content);
        document.body.appendChild(modal);

        form.addEventListener('submit', async (e) => 
        {
            e.preventDefault();
            const selectedId = select.value;
            if (!selectedId) 
            {
                return;
            }
            if (modal._submitHandler) 
            {
                await modal._submitHandler(selectedId);
            }
        });
    }

    modal._submitHandler = onSubmit;
    const selectElem = document.getElementById('deleteCategoryModalSelect');
    selectElem.replaceChildren();

    categories.forEach(cat => 
    {
        const opt = document.createElement('option');
        opt.value = cat.id;
        opt.textContent = cat.name;
        selectElem.appendChild(opt);
    });

    modal.style.display = 'block';
    setTimeout(() => selectElem.focus(), 50);
}

/**
 * @brief Muestra un formulario modal para editar los metadatos de un libro.
 * @param {Object} book - Libro que se desea editar.
 * @param {Array<Object>} categories - Categorias disponibles.
 * @param {Function} onSubmit - Funcion que guarda los cambios.
 */


function showEditBookModal(book, categories, onSubmit)
{
    const modal = document.createElement('div');
    modal.className = 'w3-modal';
    modal.style.zIndex = '9999';

    const content = document.createElement('div');
    content.className = 'w3-modal-content w3-card-4 w3-animate-zoom vault-card';
    content.style.maxWidth = '450px';

    const header = document.createElement('header');
    header.className = 'w3-container w3-border-bottom';

    const heading = document.createElement('h3');
    heading.textContent = 'Editar libro';
    heading.className = 'w3-text-teal';
    header.appendChild(heading);

    const form = document.createElement('form');
    form.className = 'w3-container w3-padding-16';

    function addField(labelText, value, type)
    {
        const label = document.createElement('label');
        label.textContent = labelText;

        const input = document.createElement('input');
        input.type = type;
        input.value = value;
        input.required = true;
        input.className = 'w3-input w3-border w3-round w3-margin-bottom';

        if (type === 'number')
        {
            input.min = '1';
            input.step = '1';
        }

        form.appendChild(label);
        form.appendChild(input);

        return input;
    }

    const titleInput = addField('Título', book.title, 'text');
    const authorInput = addField('Autor', book.author, 'text');
    const pagesInput = addField('Páginas', book.pages, 'number');

    const categoryLabel = document.createElement('label');
    categoryLabel.textContent = 'Categoría';

    const categorySelect = document.createElement('select');
    categorySelect.className = 'w3-select w3-border w3-round w3-margin-bottom';
    categorySelect.required = true;

    categories.forEach(category =>
    {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        categorySelect.appendChild(option);
    });

    categorySelect.value = String(book.category_id);

    form.appendChild(categoryLabel);
    form.appendChild(categorySelect);

    const actions = document.createElement('div');
    actions.className = 'w3-margin-top w3-right-align';

    const cancelButton = document.createElement('button');
    cancelButton.type = 'button';
    cancelButton.textContent = 'Cancelar';
    cancelButton.className = 'w3-button w3-dark-grey w3-round w3-margin-right';

    const saveButton = document.createElement('button');
    saveButton.type = 'submit';
    saveButton.textContent = 'Guardar cambios';
    saveButton.className = 'w3-button w3-teal w3-round';

    function closeModal()
    {
        modal.remove();
    }

    cancelButton.addEventListener('click', closeModal);

    actions.appendChild(cancelButton);
    actions.appendChild(saveButton);
    form.appendChild(actions);

    form.addEventListener('submit', async (event) =>
    {
        event.preventDefault();

        const updatedData = {
            title: titleInput.value.trim(),
            author: authorInput.value.trim(),
            category_id: Number(categorySelect.value),
            pages: Number(pagesInput.value)
        };

        if (!updatedData.title || !updatedData.author)
        {
            return;
        }

        saveButton.disabled = true;

        try
        {
            await onSubmit(updatedData);
            closeModal();
        }
        catch (error)
        {
            console.error('Error al actualizar el libro:', error);
        }
        finally
        {
            saveButton.disabled = false;
        }
    });

    content.appendChild(header);
    content.appendChild(form);
    modal.appendChild(content);
    document.body.appendChild(modal);

    modal.style.display = 'block';
    titleInput.focus();
}
