/**
 * @file books_front_controller.js
 * @brief Controlador frontend para gestionar la carga, listado y lectura de documentos.
 * @project Bibliotech
 * @author Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
 * @license http://www.gnu.org/licenses/gpl.txt GNU GPL 3.0
 * @date Octubre 2026
 */

document.addEventListener('DOMContentLoaded', () =>
{
    loadBooks();
    loadCategories();
});

/**
 * @brief Carga las categorías desde la API.
 * @details Genera dinámicamente las opciones del selector
 * utilizando manipulación nativa del DOM para prevenir XSS.
 */
async function loadCategories()
{
    const select = document.getElementById('category');

    if (!select)
    {
        return;
    }

    select.disabled = true;
    select.replaceChildren();

    try
    {
        const categories = await apiService.request('/categories', 'GET');

        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Seleccione una categoría';
        defaultOption.selected = true;
        defaultOption.disabled = true;

        select.appendChild(defaultOption);

        categories.forEach((category) =>
        {
            const option = document.createElement('option');

            option.value = category.id;
            option.textContent = category.name;

            select.appendChild(option);
        });

        select.disabled = false;
    }
    catch (error)
    {
        showModal('Error', 'No se pudieron cargar las categorías: ' + error.message);
    }
}



 async function loadBooks() 
 {
     try 
     {
         const books = await apiService.request('/books/my-books', 'GET');
         renderBooksTable(books);
     } 
     catch (error) 
     {
         showModal('Error', 'No se pudieron cargar los documentos: ' + error.message);
     }
 }
 
 function renderBooksTable(books) 
 {
     const tbody = document.getElementById('booksTableBody');
     tbody.replaceChildren();
 
     books.forEach(b => 
     {
         const row = document.createElement('tr');
 
         const tdTitle = document.createElement('td');
         const boldTitle = document.createElement('b');
         boldTitle.textContent = b.title;
         tdTitle.appendChild(boldTitle);
         
         const tdAuthor = document.createElement('td');
         tdAuthor.textContent = b.author;
 
         const tdCategory = document.createElement('td');
         const spanCat = document.createElement('span');
         spanCat.className = 'w3-tag w3-round w3-black';
         spanCat.textContent = b.category;
         tdCategory.appendChild(spanCat);
 
         const tdPages = document.createElement('td');
         tdPages.textContent = b.pages;
 
         const tdReading = document.createElement('td');
         
         const btnView = document.createElement('button');
         btnView.className = 'w3-button w3-teal w3-tiny w3-round w3-margin-right';
         btnView.textContent = 'Visualizar';
         btnView.addEventListener('click', () => 
         {
             showPdfModal(b.title, b.file_path);
         });
         tdReading.appendChild(btnView);
 
         // Uso del atributo nativo 'download' para forzar descarga en lugar de abrir el archivo en el navegador
         const linkDownload = document.createElement('a');
         linkDownload.className = 'w3-button w3-dark-grey w3-tiny w3-round';
         linkDownload.textContent = 'Descargar';
         linkDownload.href = b.file_path;
         linkDownload.setAttribute('download', `${b.title}.pdf`);
         tdReading.appendChild(linkDownload);
 
         const tdActions = document.createElement('td');

         //FRONTEND REQUERIMIENTO A (agregar el boton editar de ui_handlers)
         /**
         * @brief Crea el botón para editar los metadatos de un libro.
         */
         const btnEdit = document.createElement('button');
         btnEdit.className = 'w3-button w3-blue w3-tiny w3-round w3-margin-right';
         btnEdit.textContent = 'Editar';

         btnEdit.addEventListener('click', async () =>
        { 
            try
            {
                 const categories = await apiService.request('/categories', 'GET');

                showEditBookModal(b, async (bookData) =>
                 {
                   await updateBook(b.id, bookData);
                 }, categories);
            } 
             catch (error)
              {
               showModal('Error', 'No se pudieron cargar las categorías: ' + error.message);
              }
        });

        tdActions.appendChild(btnEdit);
        //boton editar creado

         const btnDelete = document.createElement('button');
         btnDelete.className = 'w3-button w3-red w3-tiny w3-round';
         btnDelete.textContent = 'Borrar';
         btnDelete.addEventListener('click', () => 
         {
             deleteBook(b.id);
         });
         tdActions.appendChild(btnDelete);
 
         row.append(tdTitle, tdAuthor, tdCategory, tdPages, tdReading, tdActions);
         tbody.appendChild(row);
     });
 }
 
 async function deleteBook(id) 
 {
     if (!confirm('¿Estás seguro de eliminar este documento de tu biblioteca?')) 
     {
         return;
     }
     
     try 
     {
         await apiService.request(`/books/${id}`, 'DELETE');
         showModal('Eliminado', 'El documento ha sido borrado.');
         loadBooks();
     } 
     catch (error) 
     {
         showModal('Error', error.message);
     }
 }
//frontend requerimiento A
 /**
 * @brief Actualiza los metadatos de un libro mediante una petición PUT.
 * @param {number} id - Identificador del libro.
 * @param {Object} bookData - Datos modificados del libro.
 */
async function updateBook(id, bookData)
{
    await apiService.request(`/books/${id}`, 'PUT', bookData);

    await loadBooks();

    showModal('Éxito', 'Los metadatos del libro se actualizaron correctamente.');
}
 //fin de la funcion requermimiento A
 const uploadForm = document.getElementById('uploadForm');
 
 if (uploadForm) 
 {
     uploadForm.addEventListener('submit', async (e) => 
     {
        /**
         * @see Cancela el evento si este es cancelable, sin detener el 
         * resto del funcionamiento del evento, es decir, puede ser llamado 
         * de nuevo. En este caso evita que se envíe el formulario al presionar
         * el botón de tipo "submit", para poder trabajar previamente con el contenido
         * del formulario representado por el objeto de tipo FormData()
         */ 
        e.preventDefault();
         
        /**
         * @note Objeto FormData: Esencial para enviar archivos binarios al backend.
         * Codifica automáticamente los campos en el formato 'multipart/form-data'.
         */
        const formData = new FormData();
        formData.append('title', document.getElementById('title').value);
        formData.append('author', document.getElementById('author').value);
        formData.append('categoryId', document.getElementById('category').value);
        formData.append('pages', document.getElementById('pages').value);
        
        // files[0] accede al binario crudo del archivo seleccionado en el input de tipo file
        formData.append('pdfFile', document.getElementById('pdfFile').files[0]);

        try 
        {
            // Pasamos true como cuarto parámetro para indicar que enviamos FormData
            await apiService.request('/books/upload', 'POST', formData, true);
            showModal('Éxito', 'Documento guardado e indexado correctamente.');
            uploadForm.reset();
            loadBooks();
        } 
        catch (error) 
        {
            showModal('Error al cargar', error.message);
        }
     });
 }