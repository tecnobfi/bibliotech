/**
 * @file validator.js
 * @brief Motor de evaluación de reglas sintácticas y de dominio.
 * @project Bibliotech
 * @author Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
 * @license http://www.gnu.org/licenses/gpl.txt GNU GPL 3.0
 * @date Octubre 2026
 */

 const i18n = require('../i18n/i18n');

 /**
  * @class Validator
  * @brief Desacopla la lógica de validación del protocolo HTTP. 
  * @details Este motor se apoya en tres patrones de diseño fundamentales:
  * 1. Fluent Interface: Permite encadenar validaciones para facilitar la lectura. https://martinfowler.com/bliki/FluentInterface.html
  * 2. Strategy: Las reglas (Email, Required, etc.) son estrategias intercambiables (Principio Abierto/Cerrado).
  * 3. Visitor: El objeto Validator se inyecta a sí mismo dentro de la regla para prestarle sus servicios (i18n).
  */
 class Validator 
 {
     constructor() 
     {
         this.i18n = i18n;
         this._target = null;
     }
 
     /**
      * @brief Realiza una validación silenciosa retornando un valor booleano (No lanza excepciones).
      * @param {*} target - El valor, cadena u objeto que será puesto a prueba.
      * @param {Object} ruleObject - Instancia de una regla específica.
      * @returns {boolean} True si el objetivo cumple la regla, False en caso contrario.
      */
     isValid(target, ruleObject) 
     {
         return ruleObject.evaluate(target);
     }
 
     /**
      * @brief Fija el objetivo en memoria para iniciar una validación fluida imperativa.
      * @param {*} target - El valor a evaluar.
      * @returns {Validator} Retorna su propia instancia (this) para permitir encadenamiento.
      */
     validateThis(target) 
     {
         this._target = target;
         return this;
     }
 
     /**
      * @brief Aplica una regla al objetivo actual. Si falla, lanza una excepción traducida.
      * @param {Object} ruleObject - Instancia de una regla específica.
      * @returns {Validator} Retorna su propia instancia (this) para continuar la cadena.
      * @throws {Error} Lanza una excepción con el mensaje traducido si la regla se rompe.
      */
     with(ruleObject) 
     {
         // Implementación del Patrón Visitor: Le pasamos nuestro contexto a la regla.
         ruleObject.validator = this; 
         ruleObject.validate(this._target);
         return this;
     }
 }
 
 module.exports = Validator;