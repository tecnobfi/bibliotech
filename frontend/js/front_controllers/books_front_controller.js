/**
 * @file books_front_controller.js
 * @brief Controlador frontend para gestionar la carga, listado, lectura y categorización de documentos.
 * @project Bibliotech
 * @author Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
 * @license http://www.gnu.org/licenses/gpl.txt GNU GPL 3.0
 * @date Noviembre 2026
 */

/**
 * @var {Array<Object>} cachedCategories
 * @brief Almacenamiento en memoria de las categorías disponibles para optimizar la interfaz.
 */
let cachedCategories = [];

document.addEventListener('DOMContentLoaded', initDashboard);

/**
 * @brief Inicializa los componentes de la vista del cliente.
 */
async function initDashboard() 
{
    setupCategoryButtons();
    await loadCategories();
    await loadBooks();
}

/**
 * @brief Configura los escuchadores de eventos para los botones de crear y eliminar categorías.
 */
function setupCategoryButtons() 
{
    const btnCreate = document.getElementById('btnOpenCreateCategory');
    const btnDelete = document.getElementById('btnOpenDeleteCategory');

    if (btnCreate) 
    {
        btnCreate.addEventListener('click', () => 
        {
            showCreateCategoryModal(handleCreateCategory);
        });
    }

    if (btnDelete) 
    {
        btnDelete.addEventListener('click', () => 
        {
            if (cachedCategories.length === 0) 
            {
                showModal('Aviso', 'No hay categorías disponibles para eliminar.');
                return;
            }
            showDeleteCategoryModal(cachedCategories, handleDeleteCategory);
        });
    }
}

/**
 * @brief Carga dinámicamente el catálogo de categorías desde el backend y lo inyecta en el selector.
 * @details Mantiene de forma estricta la política Zero-innerHTML usando manipulación nativa del DOM.
 */
async function loadCategories() 
{
    const selectElem = document.getElementById('category');
    if (!selectElem) 
    {
        return;
    }

    try 
    {
        const categories = await apiService.request('/categories', 'GET');
        cachedCategories = categories || [];

        // Limpieza segura del DOM sin innerHTML
        selectElem.replaceChildren();

        if (cachedCategories.length === 0) 
        {
            const emptyOption = document.createElement('option');
            emptyOption.value = '';
            emptyOption.textContent = '-- Sin categorías disponibles --';
            emptyOption.disabled = true;
            emptyOption.selected = true;
            selectElem.appendChild(emptyOption);
            return;
        }

        cachedCategories.forEach(cat => 
        {
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = cat.name;
            selectElem.appendChild(option);
        });
    } 
    catch (error) 
    {
        showModal('Error al cargar categorías', error.message);
    }
}

/**
 * @brief Callback asíncrono para persistir una nueva categoría.
 * @param {string} name - Nombre de la categoría a registrar.
 */
async function handleCreateCategory(name) 
{
    try 
    {
        await apiService.request('/categories', 'POST', { name });
        const modal = document.getElementById('createCategoryModal');
        if (modal) 
        {
            modal.style.display = 'none';
        }
        showModal('Éxito', 'Categoría agregada correctamente.');
        await loadCategories();
    } 
    catch (error) 
    {
        showModal('Error al crear categoría', error.message);
    }
}

/**
 * @brief Callback asíncrono para eliminar una categoría seleccionada.
 * @param {number|string} id - Identificador de la categoría.
 */
async function handleDeleteCategory(id) 
{
    try 
    {
        await apiService.request(`/categories/${id}`, 'DELETE');
        const modal = document.getElementById('deleteCategoryModal');
        if (modal) 
        {
            modal.style.display = 'none';
        }
        showModal('Éxito', 'Categoría eliminada correctamente.');
        await loadCategories();
        await loadBooks(); // Recarga los libros en caso de cascada
    } 
    catch (error) 
    {
        showModal('Error al eliminar categoría', error.message);
    }
}

/**
 * @brief Consulta los libros pertenecientes al usuario activo y los renderiza en la tabla.
 */
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

/**
 * @brief Genera las filas de la tabla de libros empleando únicamente nodos nativos del DOM.
 * @param {Array<Object>} books - Lista de libros.
 */
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
        spanCat.textContent = b.category || 'Sin categoría';
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

        const btnEdit = document.createElement('button');
        btnEdit.className = 'w3-button w3-blue w3-tiny w3-round w3-margin-right';
        btnEdit.textContent = 'Editar';

        btnEdit.addEventListener('click', () =>
        {
            showEditBookModal(b, cachedCategories, async (updatedData) =>
            {
                await apiService.request(`/books/${b.id}`, 'PUT', updatedData);
                await loadBooks();
            });
        });

        tdActions.appendChild(btnEdit);

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

/**
 * @brief Solicita confirmación y elimina un documento de la biblioteca personal.
 * @param {number} id - Identificador del libro.
 */
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

const uploadForm = document.getElementById('uploadForm');

if (uploadForm) 
{
    uploadForm.addEventListener('submit', async (e) => 
    {
        e.preventDefault();
        
        const categorySelect = document.getElementById('category');
        const selectedCategoryId = categorySelect.value;

        if (!selectedCategoryId) 
        {
            showModal('Atención', 'Debe seleccionar una categoría válida antes de subir.');
            return;
        }

        /**
         * @note Objeto FormData: Esencial para enviar archivos binarios al backend.
         * Codifica automáticamente los campos en el formato 'multipart/form-data'.
         */
        const formData = new FormData();
        formData.append('title', document.getElementById('title').value);
        formData.append('author', document.getElementById('author').value);
        formData.append('category_id', selectedCategoryId);
        formData.append('category', selectedCategoryId);
        formData.append('pages', document.getElementById('pages').value);
        
        // files[0] accede al binario crudo del archivo seleccionado en el input de tipo file
        formData.append('pdfFile', document.getElementById('pdfFile').files[0]);

        try 
        {
            // Pasamos true como cuarto parámetro para indicar que enviamos FormData
            await apiService.request('/books/upload', 'POST', formData, true);
            showModal('Éxito', 'Documento guardado e indexado correctamente.');
            uploadForm.reset();
            await loadCategories();
            await loadBooks();
        } 
        catch (error) 
        {
            showModal('Error al cargar', error.message);
        }
    });
}
