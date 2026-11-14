/**
 * @file test_utils.js
 * @brief Utilidades centrales para la construcción dinámica de la suite de pruebas en el DOM.
 * @project Bibliotech
 * @author Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
 * @license http://www.gnu.org/licenses/gpl.txt GNU GPL 3.0
 * @date Octubre 2026
 */

/**
 * @details Este módulo actúa como un mini-framework de testing nativo.
 * Aísla la lógica de manipulación del DOM de los tests en sí mismos,
 * respetando el principio de Responsabilidad Única (SRP).
 */
 const testUtils = 
 {
     // Referencia en memoria al contenedor donde se volcarán los resultados
     console: document.getElementById('api-console'),
 
     /**
      * @brief Genera un botón interactivo en el DOM para ejecutar un caso de prueba.
      * @param {string} label - Texto descriptivo del botón.
      * @param {Function} testFn - Función asíncrona (callback) que contiene la lógica del test.
      */
     createTestButton(label, testFn) 
     {
         const btn = document.createElement('button');
         btn.textContent = label;
         btn.className = "w3-button w3-block w3-section w3-round w3-grey w3-border w3-border-white w3-left-align";
         
         btn.onclick = async () => 
         {
             // Cambio visual a estado "Loading"
             btn.className = "w3-button w3-block w3-section w3-round w3-yellow"; 
             try 
             {
                 await testFn(btn);
             } 
             catch (err) 
             {
                 this.log("Error de ejecución: " + err.message, true);
                 // Cambio visual a estado "Failed"
                 btn.className = "w3-button w3-block w3-section w3-round w3-red";
             }
         };
 
         document.getElementById('test-container').appendChild(btn);
     },
 
     /**
      * @brief Formatea e inyecta la respuesta JSON de la API en la consola virtual.
      * @details Manipulación 100% segura (Zero-innerHTML). Se crea un nodo <pre>
      * para preservar los saltos de línea y la indentación del JSON stringificado.
      * @param {Object} data - Objeto JSON a imprimir.
      * @param {boolean} isError - Define si el texto debe renderizarse en color de alerta.
      */
     log(data, isError = false) 
     {
         const entry = document.createElement('pre');
         entry.style.whiteSpace = "pre-wrap";
         entry.style.color = isError ? "#ff5555" : "#55ff55";
         entry.textContent = `[${new Date().toLocaleTimeString()}] ${JSON.stringify(data, null, 2)}`;
         
         // Vaciado seguro del nodo padre antes de inyectar el nuevo resultado
         while (this.console.firstChild) 
         {
             this.console.removeChild(this.console.firstChild);
         }
         
         this.console.appendChild(entry);
     },
 
     /**
      * @brief Marca visualmente un test como superado.
      * @param {HTMLElement} btn - Referencia al nodo botón en el DOM.
      */
     setSuccess(btn) 
     {
         btn.className = "w3-button w3-block w3-section w3-round w3-green";
     }
 };