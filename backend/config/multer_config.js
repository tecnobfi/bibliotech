/**
 * @file multer_config.js
 * @brief ConfiguraciÃ³n del middleware de carga de archivos (Multipart/form-data).
 * @project Bibliotech
 * @author TecnologÃ­as InformÃ¡ticas B - Facultad de IngenierÃ­a - UNMdP
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
  * formularios `multipart/form-data`. Su funciÃ³n es extraer los archivos binarios
  * enviados por el cliente, guardarlos en el disco (o memoria) e inyectar un objeto
  * `req.file` en la peticiÃ³n para que el siguiente controlador pueda acceder a sus metadatos.
  */
 const multer = require('multer');

 // 1. Definimos la ruta absoluta al directorio de subidas
 // process.cwd() apunta a la raÃ­z del proyecto (donde se ejecutÃ³ 'node server.js')
 const uploadDir = path.join(process.cwd(), 'uploads');

 // 2. ComprobaciÃ³n y creaciÃ³n de directorio en tiempo de inicializaciÃ³n (Bootstrap)
 // Esto se ejecuta de forma sÃ­ncrona UNA SOLA VEZ cuando el servidor arranca.
 if (!fs.existsSync(uploadDir)) {
     fs.mkdirSync(uploadDir, { recursive: true });
     console.log(`ðŸ“ Directorio creado automÃ¡ticamente: ${uploadDir}`);
 }

 /**
  * @brief ConfiguraciÃ³n del motor de almacenamiento en disco.
  */
 const storage = multer.diskStorage({
     destination: (req, file, cb) => {
         cb(null, uploadDir);
     },
     filename: (req, file, cb) => {
         // PrevenciÃ³n de colisiones: Se adjunta un Timestamp (Date.now) al nombre original
         // para garantizar que dos usuarios subiendo un archivo llamado "libro.pdf" no se sobrescriban.
         cb(null, Date.now() + '-' + file.originalname);
     }
 });

 /**
  * @brief Filtro de seguridad (Whitelisting).
  * @details EvalÃºa el MIME Type del archivo entrante. Si no es un PDF, rechaza la promesa
  * pasÃ¡ndole un error al Global Error Handler.
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
  * @note Establecemos un lÃ­mite estricto de 15MB para prevenir ataques de denegaciÃ³n de servicio (DoS)
  * por saturaciÃ³n de disco o memoria.
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
