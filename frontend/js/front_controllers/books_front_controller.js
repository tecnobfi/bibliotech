/**
 * @file books_front_controller.js
 * @brief Controlador frontend para gestionar la carga, listado y lectura de documentos.
 * @project Bibliotech
 * @author Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
 * @license http://www.gnu.org/licenses/gpl.txt GNU GPL 3.0
 * @date Octubre 2026
 */

 document.addEventListener('DOMContentLoaded', loadBooks);

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
         
         const btnEdit = document.createElement('button');
         // Le pongo w3-tiny y w3-round para que sea idéntico a tus otros botones
         btnEdit.className = 'w3-button w3-orange w3-text-white w3-tiny w3-round w3-margin-right';
         btnEdit.textContent = 'Editar';
         btnEdit.addEventListener('click', () => 
         {
             showEditBookModal(b, (updatedData) => {
                 updateBook(b.id, updatedData);
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

 /**
 * @brief Envía la solicitud PUT para actualizar los metadatos de un libro.
 * @param {number} bookId ID del libro a editar.
 * @param {Object} bookData Objeto con { title, author, category, pages }.
 */
async function updateBook(bookId, bookData) {
    try {
        // apiService.request ya maneja el token y ataja errores de red automáticamente
        const response = await apiService.request(`/books/${bookId}`, 'PUT', bookData);
        
        // Usamos la alerta global segura del proyecto
        showModal('Éxito', response.message || 'Documento actualizado correctamente');
        
        // Recargamos la tabla para que el usuario vea los datos nuevos instantáneamente
        loadBooks();
    } catch (error) {
        showModal('Error al actualizar', error.message);
    }
}
 
 const uploadForm = document.getElementById('uploadForm');
 
 if (uploadForm) 
 {
     uploadForm.addEventListener('submit', async (e) => 
     {
         e.preventDefault();
         
         /**
          * @note Objeto FormData: Esencial para enviar archivos binarios al backend.
          * Codifica automáticamente los campos en el formato 'multipart/form-data'.
          */
         const formData = new FormData();
         formData.append('title', document.getElementById('title').value);
         formData.append('author', document.getElementById('author').value);
         formData.append('category', document.getElementById('category').value);
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