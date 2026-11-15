# ⧉ Módulo de Categorías Dinámicas - Bibliotech

Documentación técnica y funcional de la implementación de **Categorías Dinámicas** para la plataforma **Bibliotech**. Esta funcionalidad normaliza la entidad de categorías en la base de datos, eliminando las opciones fijas del HTML y habilitando la gestión interactiva (alta, baja y selección) en tiempo real mediante una arquitectura en N capas y política estricta **Zero-innerHTML**.

---

## 📌 Resumen de Cambios Realizados

1. **Base de Datos (MySQL)**:
   - Creación de la tabla `category` con restricción de unicidad (`UNIQUE`) en el nombre.
   - Modificación de la tabla `books` para relacionar `category_id` como Clave Foránea (`FOREIGN KEY`) hacia `category(id)`.
   - Procedimientos Almacenados:
     - `sp_find_all_categories()`: Obtiene todas las categorías disponibles.
     - `sp_create_category(IN p_name VARCHAR(100))`: Inserta una categoría y devuelve su ID autoincremental (`LAST_INSERT_ID()`).
     - `sp_delete_category(IN p_id INT)`: Elimina una categoría por su ID.
     - `sp_find_books_by_user` y `sp_find_book_by_id`: Actualizados con `JOIN category c ON b.category_id = c.id` devolviendo `c.name as category`.
2. **Backend (Node.js & Express)**:
   - **Repositorio (`category_repository.js`)**: Patrón Repository con consultas preparadas paramétricas (`db.execute('CALL sp_...')`). Prevención total de inyección SQL.
   - **Controlador (`category_controller.js`)**: Métodos `getAllCategories`, `createCategory` y `deleteCategory`. Manejo de errores centralizado (delegación a `next(error)` sin responder 500).
   - **Rutas (`category_routes.js`)**: Montadas en `/api/categories` en `server.js`.
   - **Validación (`validation_middleware.js`)**: Validación Fail-Fast para alta y baja de categorías.
   - **Internacionalización y Errores**: Manejo del error de duplicados (`ER_DUP_ENTRY` -> HTTP 409) en `global_error_middleware.js` y traducción de mensajes en `locales/es.json`.
3. **Frontend (Vanilla JS & W3.CSS)**:
   - Vaciado del `<select id="category">` estático en `client_dashboard.html`.
   - Inyección dinámica en `books_front_controller.js` usando la API nativa del DOM (`document.createElement`, `textContent`, `replaceChildren`).
   - Modales interactivos en `ui_handlers.js` para crear y eliminar categorías mediante el teclado (**Enter**) o clics en los botones.

---

## 🛠️ Arquitectura y Flujo de Datos

```
[Navegador / Frontend]
        │
        │ 1. Petición HTTP (Fetch con token JWT)
        ▼
[server.js] ───────────────► Ruta base: /api/categories
        │
        ▼
[category_routes.js] ──────► Autenticación (verifyToken)
        │
        ▼
[validation_middleware.js] ─► Validación sintáctica (Fail-Fast)
        │
        ▼
[category_controller.js] ──► Control de flujo y captura de excepciones (next(error))
        │
        ▼
[category_repository.js] ──► Llamada paramétrica a Stored Procedures
        │
        ▼
[MySQL (init.sql)] ────────► sp_find_all_categories / sp_create_category / sp_delete_category
```

## 🌐 1. Endpoints de la API REST

Ruta base: `/api/categories`

| Método | Endpoint | Middleware | Código Éxito | Respuesta / Descripción |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/api/categories` | Ninguno / Auth | `200 OK` | Array de objetos `[{ id, name }, ...]` |
| **POST** | `/api/categories` | `verifyToken`, `validateCategoryCreate` | `201 Created` | `{ message, id, name }` |
| **DELETE** | `/api/categories/:id` | `verifyToken`, `validateCategoryDelete` | `200 OK` | `{ message }` |

---

## 🖥️ 2. Frontend y Experiencia de Usuario

### Carga Dinámica al Iniciar
En `books_front_controller.js`, la función `loadCategories()`:
1. Realiza una petición `GET /api/categories`.
2. Limpia el elemento `<select id="category">` con `selectElem.replaceChildren()`.
3. Por cada categoría devuelta crea un elemento `<option>` seguro:
   ```javascript
   const option = document.createElement('option');
   option.value = cat.id;        // Se envía el ID al backend
   option.textContent = cat.name; // Texto visible para el usuario
   selectElem.appendChild(option);
   ```

### Botón `+ Nueva` (Crear Categoría)
- Ubicado junto al selector de categorías.
- Abre una ventana modal con un `<input type="text">` con foco automático.
- Al escribir el nombre y presionar **Enter** o el botón "Guardar", se envía `POST /api/categories`.
- Si la creación es exitosa, se cierra el modal, se muestra confirmación y **se recarga automáticamente el selector** sin necesidad de refrescar la página.

### Botón `- Eliminar` (Eliminar Categoría)
- Abre una ventana modal con un desplegable que lista todas las categorías existentes.
- Al elegir una y presionar **Enter** o "Eliminar", se ejecuta `DELETE /api/categories/:id`.
- Tras confirmarse el borrado, se actualizan inmediatamente tanto el selector de categorías como la tabla de libros.

---

## 🧪 3. Modo Testing (`NODE_ENV=testing`)

En `backend/.env`, al activar el modo testing:
```env
NODE_ENV=testing
```
El servidor levanta la interfaz visual de pruebas (`tests.html`), donde se incluyeron:
- **Test Listar Categorías**: Prueba automática para validar que `GET /api/categories` retorne un array válido.
- **Test Subir Libro PDF (Simulado)**: Adaptado para asociar el libro con `category_id: 1` de forma compatible con la nueva clave foránea.
