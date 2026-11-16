/**
 * @file books_front_controller.js
 * @brief Controlador frontend para gestionar la carga, listado y lectura de documentos.
 * @project Bibliotech
 * @author Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
 * @license http://www.gnu.org/licenses/gpl.txt GNU GPL 3.0
 * @date Octubre 2026
 */

/** @brief Caché local de categorías, reutilizada por el modal de edición para no volver a pedirlas a la API. */
let availableCategories = [];

document.addEventListener('DOMContentLoaded', () =>
{
    loadCategories();
    loadBooks();
});

/**
 * @brief Carga las categorías desde la API e inyecta las <option> en el select.
 * @note Solo createElement/textContent: textContent trata el texto como dato,
 * nunca como HTML, lo que previene XSS aunque un nombre de categoría sea malicioso.
 */
async function loadCategories()
{
    try
    {
        // 1. Ajustamos la ruta para que coincida con el server.js
        const categories = await apiService.request('/api/categories', 'GET');
        availableCategories = categories; 

        const select = document.getElementById('category');
        
        // Limpiamos todo lo viejo
        select.replaceChildren();

        // 2. Creamos la opción por defecto puramente con nodos
        const defaultOption = document.createElement('option');
        defaultOption.value = "";
        defaultOption.textContent = "Seleccione una categoría";
        defaultOption.disabled = true;
        defaultOption.selected = true;
        select.appendChild(defaultOption);

        // Iteramos las categorías de la base de datos
        categories.forEach(c =>
        {
            const option = document.createElement('option');
            option.value = c.id;
            option.textContent = c.name;
            select.appendChild(option);
        });
    }
    catch (error)
    {
        // Delegamos el error a la UI como corresponde
        showModal('Error', 'No se pudieron cargar las categorías: ' + error.message);
    }
}

async function loadBooks() 
{
    try 
    {
        // CORRECCIÓN: Se agrega '/api' a la ruta
        const books = await apiService.request('/api/books/my-books', 'GET');
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
        const btnDelete = document.createElement('button');
        btnDelete.className = 'w3-button w3-red w3-tiny w3-round';
        btnDelete.textContent = 'Borrar';
        btnDelete.addEventListener('click', () => 
        {
            deleteBook(b.id);
        });
        
        const btnEdit = document.createElement('button');
        btnEdit.className = 'w3-button w3-blue w3-tiny w3-round w3-margin-right';
        btnEdit.textContent = 'Editar';
        btnEdit.addEventListener('click', () =>
        {
            openEditBook(b);
        });
        
        tdActions.append(btnEdit, btnDelete);

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
        // CORRECCIÓN: Se agrega '/api' a la ruta
        await apiService.request(`/api/books/${id}`, 'DELETE');
        showModal('Eliminado', 'El documento ha sido borrado.');
        loadBooks();
    } 
    catch (error) 
    {
        showModal('Error', error.message);
    }
}

/**
 * @brief Abre el modal de edición y envía los metadatos modificados al backend.
 * @param {Object} book - Libro seleccionado en la tabla.
 * @note El callback relanza los errores de la API: el modal los muestra
 * en línea y permanece abierto para que el usuario corrija sin perder lo escrito.
 */

function openEditBook(book)
{
    showEditBookModal(book, availableCategories, async (payload) =>
    {
        await apiService.request(`/books/${book.id}`, 'PUT', payload);
        loadBooks();
    });
}

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
        
        // CORRECCIÓN: Ahora se envía category_id en lugar de category
        formData.append('category_id', document.getElementById('category').value);
        formData.append('pages', document.getElementById('pages').value);
        
        // files[0] accede al binario crudo del archivo seleccionado en el input de tipo file
        formData.append('pdfFile', document.getElementById('pdfFile').files[0]);

        try 
        {
            // CORRECCIÓN: Se agrega '/api' a la ruta
            // Pasamos true como cuarto parámetro para indicar que enviamos FormData
            await apiService.request('/api/books/upload', 'POST', formData, true);
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