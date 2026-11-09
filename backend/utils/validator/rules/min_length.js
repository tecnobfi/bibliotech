/**
 * @file min_length.js
 * @brief Regla de validación: Longitud mínima de caracteres.
 * @project Bibliotech
 * @author Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
 * @license http://www.gnu.org/licenses/gpl.txt GNU GPL 3.0
 * @date Octubre 2026
 */

 class MinLength 
 {
    /**
     * @param {number} minLength - Cantidad mínima de caracteres exigidos.
     * @param {string} messageName - Clave del diccionario de traducciones.
     */
    constructor(minLength, messageName = "CT_MIN_LENGTH") 
    {
        this._minLength = minLength;
        this._messageName = messageName;
        this.validator = null; // Será inyectado por el Patrón Visitor
    }

    evaluate(target) 
    {
        if (typeof target !== 'string') return false;
        return target.trim().length >= this._minLength;
    }

    validate(target) 
    {
        if (!this.evaluate(target)) 
        {
            const message = this.validator.i18n.getMessage(this._messageName);
            throw new Error(message);
        }
    }
}
module.exports = MinLength;