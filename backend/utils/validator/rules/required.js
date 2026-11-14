/**
 * @file required.js
 * @brief Regla de validación: Presencia obligatoria de un dato.
 * @project Bibliotech
 * @author Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
 * @license http://www.gnu.org/licenses/gpl.txt GNU GPL 3.0
 * @date Octubre 2026
 */

 class Required 
 {
    constructor(messageName = "CT_REQUIRED_FIELD") 
    {
        this._messageName = messageName;
        this.validator = null;
    }

    evaluate(target) 
    {
        if (target === null || target === undefined) return false;
        if (typeof target === 'string') return target.trim().length > 0;
        return true;
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
module.exports = Required;