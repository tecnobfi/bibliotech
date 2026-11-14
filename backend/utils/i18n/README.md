# Módulo i18n (`utils/i18n`)

El módulo **i18n** (abrev. de *Internationalization*: 'i' + 18 letras + 'n') gestiona la localización e internacionalización de mensajes del sistema. Carga recursos de texto estáticos desde archivos JSON y resuelve traducciones según el idioma configurado activamente.

---

## 🏛️ Patrón Singleton

Este módulo implementa el patrón de diseño **Singleton**, garantizando que exista **una única instancia en memoria** durante todo el ciclo de vida de la aplicación backend. Todas las importaciones mediante `require('./utils/i18n/i18n')` referencian al mismo objeto congelado (`Object.freeze`).

---

## 📁 Estructura del Módulo

```text
utils/i18n/
├── locales/
│   ├── es.json
│   └── en.json
├── i18n.js
└── README.md



🏷️ Convención de Claves: CT_ (Constant Text)
Todas las claves dentro de los diccionarios JSON deben llevar el prefijo CT_ (del inglés Constant Text). Esto permite distinguir rápidamente en el código fuente los identificadores de recursos estáticos traducibles de las cadenas de texto literales.

Ejemplo de locales/es.json:

```JSON
{
  "CT_INVALID_EMAIL": "El formato de correo electrónico no es válido",
  "CT_INVALID_RESOURCE_CONSTANT": "Recurso de lenguaje inválido o clave inexistente"
}
```

Ejemplo de locales/en.json:

```JSON
{
  "CT_INVALID_EMAIL": "Invalid email address format",
  "CT_INVALID_RESOURCE_CONSTANT": "Invalid language resource or missing key"
}
```

🛠️ Métodos y Propiedades
1. language (Getter / Setter)
Permite consultar o cambiar el idioma activo del sistema. Si se asigna un idioma que no posee un archivo JSON cargado, se mantiene el idioma actual y se emite una advertencia por consola.

```Javascript
const i18n = require('./utils/i18n/i18n');

i18n.language = 'en'; // Cambia el idioma activo a inglés
console.log(i18n.language); // 'en'
```


2. getMessage(messageName)
Busca y retorna el mensaje correspondiente a la clave messageName para el idioma actualmente configurado.

Parámetros: messageName (string): Clave con prefijo CT_.

Retorno: string: El texto traducido.

Excepciones: Si la clave no existe en el idioma activo, intenta recurrir al mensaje de respaldo (fallback) o lanza un error descriptivo.

💻 Ejemplo de Uso
```Javascript
const i18n = require('./utils/i18n/i18n');

// Idioma por defecto: Español ('es')
console.log(i18n.getMessage('CT_INVALID_EMAIL'));
// Salida: "El formato de correo electrónico no es válido"

// Cambiar a Inglés
i18n.language = 'en';
console.log(i18n.getMessage('CT_INVALID_EMAIL'));
// Salida: "Invalid email address format"
```