/**
 * @file positive_number.js
 * @brief Regla de validación: Valor numérico estrictamente positivo (> 0).
 * @project Bibliotech
 * @author Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
 * @license http://www.gnu.org/licenses/gpl.txt GNU GPL 3.0
 * @date Octubre 2026
 */

 class PositiveNumber 
 {
    constructor(messageName = "CT_POSITIVE_NUMBER") 
    {
        this._messageName = messageName;
        this.validator = null;
    }

    evaluate(target) 
    {
        const num = Number(target);
        return !isNaN(num) && num > 0;
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
module.exports = PositiveNumber;