/**
 * @file multer_config.js
 * @brief Configuración del middleware de carga de archivos (Multipart/form-data).
 * @project Bibliotech
 * @author Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
 * @license http://www.gnu.org/licenses/gpl.txt GNU GPL 3.0
 * @date Octubre 2026
 */

 const fs = require('fs');
 const path = require('path');
 
 /**
  * @details Multer es un middleware exclusivo para Node.js y Express que procesa 
  * formularios `multipart/form-data`. Su función es extraer los archivos binarios 
  * enviados por el cliente, guardarlos en el disco (o memoria) e inyectar un objeto 
  * `req.file` en la petición para que el siguiente controlador pueda acceder a sus metadatos.
  */
 const multer = require('multer');
 
 // 1. Definimos la ruta absoluta al directorio de subidas
 // process.cwd() apunta a la raíz del proyecto (donde se ejecutó 'node server.js')
 const uploadDir = path.join(process.cwd(), 'uploads');
 
 // 2. Comprobación y creación de directorio en tiempo de inicialización (Bootstrap)
 // Esto se ejecuta de forma síncrona UNA SOLA VEZ cuando el servidor arranca.
 if (!fs.existsSync(uploadDir)) {
     fs.mkdirSync(uploadDir, { recursive: true });
     console.log(`📁 Directorio creado automáticamente: ${uploadDir}`);
 }
 
 /**
  * @brief Configuración del motor de almacenamiento en disco.
  */
 const storage = multer.diskStorage({
     destination: (req, file, cb) => {
         cb(null, uploadDir); 
     },
     filename: (req, file, cb) => {
         // Prevención de colisiones: Se adjunta un Timestamp (Date.now) al nombre original 
         // para garantizar que dos usuarios subiendo un archivo llamado "libro.pdf" no se sobrescriban.
         cb(null, Date.now() + '-' + file.originalname);
     }
 });
 
 /**
  * @brief Filtro de seguridad (Whitelisting).
  * @details Evalúa el MIME Type del archivo entrante. Si no es un PDF, rechaza la promesa 
  * pasándole un error al Global Error Handler.
  */
 const fileFilter = (req, file, cb) => {
     const allowedTypes = ['application/pdf'];
     if (allowedTypes.includes(file.mimetype)) {
         cb(null, true);
     } else {
         cb(new Error('Invalid file type. Only PDF files are allowed.'), false);
     }
 };
 
 /**
  * @brief Instancia final del middleware exportada.
  * @note Establecemos un límite estricto de 15MB para prevenir ataques de denegación de servicio (DoS) 
  * por saturación de disco o memoria.
  */
 const upload = multer({
     storage: storage,
     fileFilter: fileFilter,
     limits: {
         fileSize: 15 * 1024 * 1024 // 15 Megabytes
     }
 });
 
 // El string 'pdfFile' DEBE coincidir exactamente con el atributo name="..." en el HTML (o clave FormData)
 module.exports = upload.single('pdfFile');