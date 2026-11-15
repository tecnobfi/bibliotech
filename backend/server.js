/**
 * @file server.js
 * @brief Punto de entrada principal para el servidor Backend Express.
 * @project Bibliotech
 * @author Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
 * @license http://www.gnu.org/licenses/gpl.txt GNU GPL 3.0
 * @date Octubre 2026
 */

/**
 * @details Carga las variables de entorno desde el archivo .env.
 * Un archivo .env es un archivo de texto plano utilizado en el desarrollo 
 * de software para almacenar configuración y credenciales sensibles 
 * (claves API, credenciales de bases de datos, firmas JWT) fuera del código fuente. 
 * Se sitúa en la raíz del proyecto, usa pares clave-valor y NUNCA debe 
 * subirse al control de versiones (Git).
 */
require('dotenv').config();

/**
 * @details Express es un framework web minimalista, rápido y flexible para Node.js, 
 * diseñado para facilitar la creación de aplicaciones back-end y APIs. 
 * Proporciona una capa ligera de características fundamentales (enrutamiento y 
 * gestión de middleware), permitiendo construir servidores web de manera eficiente 
 * sin imponer estructuras rígidas.
 */
const express = require('express');

/**
 * @brief CORS (Cross-Origin Resource Sharing).
 * @details Middleware de seguridad que permite a los navegadores realizar 
 * peticiones HTTP a este servidor desde un origen (dominio/puerto) distinto 
 * al del frontend.
 */
const cors = require('cors');

/**
 * @brief Módulo de utilidad nativo de Node.js para el manejo de rutas de archivos,
 * garantizando compatibilidad entre sistemas de archivos Windows y UNIX.
 */
const path = require('path');

/**
 * @brief Importación de enrutadores modulares (Routers).
 * @details Delegamos las rutas específicas a módulos separados para mantener
 * el principio de responsabilidad única y evitar un server.js monolítico.
 */
const authRoutes = require('./routes/auth_routes');
const bookRoutes = require('./routes/book_routes');
const adminRoutes = require('./routes/admin_routes');
const categoryRoutes = require('./routes/category_routes');
const viewRoutes = require('./routes/view_routes');
const testsRoutes = require('./routes/tests_routes');

// Inyección del manejador global de excepciones
const globalErrorMiddleware = require('./middleware/global_error_middleware');

// Instancia principal de la aplicación Express
const app = express();

// --- 1. Middlewares de Configuración Global ---

app.use(cors());

/**
 * @details Estos dos middlewares nativos de Express interceptan las peticiones 
 * entrantes antes de que lleguen a las rutas. Transforman el cuerpo (body) 
 * de la petición (texto plano o buffers) en objetos JavaScript accesibles 
 * a través de `req.body`.
 * - express.json(): Parsea payloads en formato application/json (APIs REST).
 * - express.urlencoded(): Parsea datos enviados mediante formularios HTML estándar.
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- 2. Servidores de Archivos Estáticos ---

/**
 * @brief Exposición de la carpeta física de subidas (PDFs).
 * @note La creación física de este directorio en el disco es responsabilidad 
 * del módulo de configuración `multer_config.js`.
 */
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/**
 * @brief Servidor estático del Frontend.
 * @details Permite que el navegador descargue libremente los recursos visuales 
 * (.html, .css, .js, .png) necesarios para renderizar las pantallas. 
 * Como server.js está dentro de /backend, subimos un nivel de directorio.
 */
app.use(express.static(path.join(__dirname, '../frontend')));

// --- 3. Registro de Rutas de la API (Endpoints) ---

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/categories', categoryRoutes);

// --- 4. Enrutador de Vistas (UI o Testing) ---

/**
 * @details Variable de entorno NODE_ENV. Es un estándar en la industria 
 * utilizar esta variable para bifurcar el comportamiento del sistema según 
 * el entorno donde se esté ejecutando (desarrollo, producción, testing).
 */
if (process.env.NODE_ENV === 'testing') 
{
    app.use('/', testsRoutes);
} 
else 
{
    app.use('/', viewRoutes);
}

// --- 5. Manejador de Contingencias ---

/**
 * @note Debe ser ESTRICTAMENTE el último middleware registrado en la aplicación.
 * Solo captura las peticiones que fallaron durante las etapas 3 o 4.
 */
app.use(globalErrorMiddleware);

// --- 6. Inicialización del Servicio TCP ---

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => 
{
    console.log(`==========================================`);
    console.log(`🚀 Bibliotech listo en:`);
    console.log(`   Punto de entrada: http://localhost:${PORT}`);
    console.log(`==========================================`);
});
