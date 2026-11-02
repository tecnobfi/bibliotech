# Módulo Validator (`utils/validator`)

El módulo **Validator** es un motor de validación de datos desacoplado del protocolo HTTP y de la infraestructura de la aplicación. Su objetivo es evaluar y validar datos de entrada mediante reglas encapsuladas, aplicando mensajes de error traducidos y lanzando excepciones cuando las reglas no se cumplen.

---

## ⧉ Patrones de Diseño Aplicados

1. **Fluent Interface (Interfaz Fluida):** Permite encadenar llamadas a métodos (`validateThis(...).with(...)`) mejorando la legibilidad del código.
2. **Visitor / Encadenamiento:** La clase `Validator` actúa como visitante al inyectar su propia instancia (`ruleObject.validator = this`) dentro de la regla que se está ejecutando.
3. **Strategy / Rules:** Cada archivo dentro de la carpeta `rules/` encapsula una regla de validación independiente (`Email`, `Password`, `Required`), respetando el principio SOLID de **Abierto/Cerrado (OCP)**.

---

## ⧉ Estructura del Módulo

```text
utils/validator/
├── rules/    #reglas de validación
├── validator.js
└── README.md
```

⧉ Métodos Principales de Validator
1. isValid(target, ruleObject)
Evalúa un objetivo contra una regla de forma booleana y silenciosa (no lanza excepciones ni consulta traducciones).

Parámetros:

target (*): El valor a evaluar.

ruleObject (Object): Instancia de la regla que implementa el método evaluate(target).

Retorno: boolean (true si cumple, false si no).

2. validateThis(target)
Inicia el flujo de validación imperativa para un valor objetivo.

Parámetros: target (*): El valor a evaluar.

Retorno: Instancia de Validator (this) para permitir encadenamiento.

3. with(ruleObject)
Aplica una regla al valor cargado previamente con validateThis(). Si la regla falla, esta lanzará una excepción con el mensaje de error traducido.

Parámetros: ruleObject (Object): Instancia de la regla.

Retorno: Instancia de Validator (this).

⧉ Ejemplos de Uso
Uso Booleano Silencioso (isValid)

```JavaScript
const Validator = require('./utils/validator/validator');
const Email = require('./utils/validator/rules/email');

const validator = new Validator();
const esValido = validator.isValid("usuario@dominio.com", new Email());

console.log(esValido); // true
```
Uso Imperativo con Excepciones e i18n (validateThis + with)
```JavaScript
const Validator = require('./utils/validator/validator');
const Email = require('./utils/validator/rules/email');

const validator = new Validator();

try {
    validator
        .validateThis("correo-invalido")
        .with(new Email());
} catch (error) {
    console.error(error.message); 
    // Ejemplo de salida: "El formato de correo electrónico no es válido: correo-invalido"
}
```

➕ Creación de una Nueva Regla
Para agregar una nueva regla dentro de utils/validator/rules/:

Crear el archivo de la regla en snake_case (ej. required.js).

Definir una clase en PascalCase con los métodos evaluate(target) y validate(target).

Usar this.validator.i18n.getMessage() para obtener el mensaje de error.

```JavaScript
class Required {
    constructor(messageName = "CT_REQUIRED_FIELD") {
        this._messageName = messageName;
        this.validator = null;
    }

    evaluate(target) {
        if (target === null || target === undefined) return false;
        if (typeof target === 'string') return target.trim().length > 0;
        return true;
    }

    validate(target) {
        if (!this.evaluate(target)) {
            const message = this.validator.i18n.getMessage(this._messageName);
            throw new Error(`${message}`);
        }
    }
}

module.exports = Required;
```