/**
 * @file global_error_middleware.js
 * @brief Manejador centralizado y global para atrapar y traducir errores de contingencia del sistema.
 * @project Bibliotech
 * @author Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
 * @license http://www.gnu.org/licenses/gpl.txt GNU GPL 3.0
 * @date Octubre 2026
 */

/**
 * @details En la arquitectura de Express, un middleware de manejo de errores se define 
 * estrictamente por tener cuatro argumentos (err, req, res, next). Express utiliza 
 * la cantidad de argumentos (arity) para identificar que este middleware no es de 
 * flujo normal, sino una "red de seguridad" que solo se ejecuta cuando otro 
 * componente llama a next(error) o lanza una excepción no capturada.
 */
const i18n = require('../utils/i18n/i18n');

/**
 * @brief Atrapa excepciones globales, traduce el error a un mensaje amigable y evita que el servidor colapse.
 * @param {Error} err - Objeto de error nativo o personalizado capturado por la aplicación.
 * @param {Object} req - Objeto de petición HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @param {Function} next - Función para pasar el control (rara vez usada aquí, ya que este es el final del ciclo).
 */
const globalErrorMiddleware = (err, req, res, next) => 
{
    // Registro del error en el servidor para propósitos de auditoría y depuración.
    console.error(`[Error Handler] Detalle:`, err.stack || err);

    // 1. Errores específicos del driver de MySQL (Base de Datos)
    if (err.code) 
    {
        if (err.code === 'ER_DUP_ENTRY') 
        {
            const message = i18n.getMessage('CT_MYSQL_ER_DUP_ENTRY');
            return res.status(409).json({ message });
        }

        if (err.code === 'ER_ROW_IS_REFERENCED_2')
        {
            const message = i18n.getMessage('CT_MYSQL_ER_ROW_IS_REFERENCED');
            return res.status(409).json({ message });
        }

        if (err.code === 'ECONNREFUSED') 
        {
            const message = i18n.getMessage('CT_MYSQL_ECONNREFUSED');
            return res.status(500).json({ message });
        }
    }

    // 2. Errores de la librería de carga de archivos (Multer)
    if (err.name === 'MulterError') 
    {
        const message = i18n.getMessage('CT_ERR_MULTER_GENERIC');
        return res.status(400).json({ message });
    }

    if (err.message && err.message.includes('Only PDF files')) 
    {
        const message = i18n.getMessage('CT_ERR_MULTER_PDF');
        return res.status(400).json({ message });
    }

    // 3. Errores genéricos HTTP o contingencias internas del sistema
    const statusCode = err.statusCode || 500;
    const message = i18n.getMessage('CT_ERR_INTERNAL');

    /**
     * @note Seguridad en Producción: Nunca se debe enviar el 'err.stack' (trazabilidad del código) 
     * al cliente en un entorno de producción, ya que expone la estructura interna del servidor 
     * y facilita ataques de inyección o reconocimiento.
     */
    res.status(statusCode).json({
        message: statusCode === 500 ? message : err.message,
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};

module.exports = globalErrorMiddleware;
