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
 function showModal(title, message)//muestra mensajes
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
 function showPdfModal(title, pdfUrl)//permite ver el PDF 
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

 //frontend requerimiento A + requerimiento C

 /**
 * @brief Construye un modal para editar los metadatos de un libro.
 * @details permite modificar los metadatos y seleccionar una categoria
 * desde la base de datos
 * 
 * @param {Object} book - Libro que queremos editar. Book es un objeto que contiene los datos del libro
 * @param {Function} onSave - Función que guardará los cambios. 
 * @param {Array} categories - Categorías disponibles.
 */
function showEditBookModal(book, onSave,categories)//estructura modal para crear y mostrar una ventana para editar los datos de un libro.
{

      // Evitamos crear dos ventanas de edición al mismo tiempo.
    const previousModal = document.getElementById('editBookModal');

    if (previousModal)
    {
        previousModal.remove();
    }

    //crear el modal
    const modal = document.createElement('div'); //Crea un elemento HTML div desde JavaScript.
    modal.id = 'editBookModal';//le asignamos un identificador
    modal.className = 'w3-modal';//Le asigna una clase CSS para que se comporte visualmente como una ventana modal.
   
    //crear el contenido del modal
    const content = document.createElement('div');
    content.className = 'w3-modal-content w3-card-4 w3-padding vault-card';
    content.style.maxWidth = '450px';

    //crea el titulo
    const title = document.createElement('h3');
    title.textContent = 'Editar documento';

    content.appendChild(title);

    //Crear el formulario.
    const form = document.createElement('form');

    /**
     * @brief Crea un campo de entrada con su etiqueta.
     * @param {string} labelText - Texto de la etiqueta.
     * @param {string|number} value - Valor inicial.
     * @param {string} type - Tipo de input.
     * @returns {HTMLInputElement} Campo creado.
     */
    function createField(labelText, value, type)
    {
        const label = document.createElement('label');
        label.textContent = labelText;

        const input = document.createElement('input');
        input.className = 'w3-input w3-border w3-margin-bottom';
        input.type = type;
        input.value = value ?? '';
        input.required = true;

        form.appendChild(label);
        form.appendChild(input);

        return input;
    }

    // Crear los campos de edición.
const inputTitle = createField('Título', book.title, 'text');
const inputAuthor = createField('Autor', book.author, 'text');

// Crear el selector dinámico de categorías.
const labelCategory = document.createElement('label');
labelCategory.textContent = 'Categoría';

const selectCategory = document.createElement('select');
selectCategory.className = 'w3-select w3-border w3-margin-bottom';
selectCategory.required = true;

categories.forEach((category) =>
{
    const option = document.createElement('option');
    option.value = category.id;
    option.textContent = category.name;

    if (Number(book.category_id) === Number(category.id))
    {
        option.selected = true;
    }

    selectCategory.appendChild(option);
});

form.appendChild(labelCategory);
form.appendChild(selectCategory);

const inputPages = createField('Páginas', book.pages, 'number');

    // Establecer límites de los campos.
    inputTitle.maxLength = 100;
    inputAuthor.maxLength = 100;
    inputPages.min = '0';
    inputPages.step = '1';

    // Crear el botón Guardar.
    const btnSave = document.createElement('button');
    btnSave.textContent = 'Guardar cambios';
    btnSave.className = 'w3-button w3-teal w3-margin-right';
    btnSave.type = 'submit';

    // Crear el botón Cancelar.
    const btnCancel = document.createElement('button');
    btnCancel.textContent = 'Cancelar';
    btnCancel.className = 'w3-button w3-grey';
    btnCancel.type = 'button';

    // Cerrar el modal sin guardar.
    btnCancel.addEventListener('click', () =>
    {
        modal.remove();
    });

    // Guardar los datos modificados.
    form.addEventListener('submit', async (e) =>
    {
        e.preventDefault();

        // Obtener los valores ingresados por el usuario.
        const bookData = {
           title: inputTitle.value.trim(),
           author: inputAuthor.value.trim(),
           categoryId: Number(selectCategory.value),
           pages: Number(inputPages.value)
        };

        // Validar los datos antes de enviarlos. 
     if (!bookData.title || !bookData.author || !Number.isInteger(bookData.categoryId) ||
         bookData.categoryId <= 0 || inputPages.value.trim() === '' || !Number.isInteger(bookData.pages) ||
         bookData.pages < 0)
        {
            showModal('Error', 'Los datos ingresados no son válidos.');
            return;
        }

        btnSave.disabled = true;

        try
        {
            // Ejecutar la función recibida como parámetro.
            await onSave(bookData);

            // Cerrar el modal si se guardó correctamente.
            modal.remove();
        }
        catch (error)
        {
            showModal('Error', error.message);
        }
        finally
        {
            btnSave.disabled = false;
        }
    });

    // Agregar los botones al formulario.
    form.appendChild(btnSave);
    form.appendChild(btnCancel);

     //une todos los elementos
    content.appendChild(form);//muestra el formulario.
    modal.appendChild(content);
    document.body.appendChild(modal);//Agrega el modal a la página web.

    modal.style.display = 'block';//Hace que el modal se muestre.
}