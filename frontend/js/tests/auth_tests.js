/**
 * @file auth_tests.js
 * @brief Suite de pruebas unitarias para los endpoints de autenticación y registro.
 * @project Bibliotech
 * @author Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
 * @license http://www.gnu.org/licenses/gpl.txt GNU GPL 3.0
 * @date Octubre 2026
 */

/**
 * @details El testing de APIs REST no solo debe verificar el "camino feliz" (Happy Path),
 * sino que debe validar intencionalmente los códigos de estado HTTP de error (400, 401, 409)
 * para asegurar que los escudos preventivos (Middlewares) funcionan correctamente.
 */

// 1. Test Login Correcto (Código Esperado: 200 OK)
testUtils.createTestButton("Test Login Correcto (pepe y 12345)", async (btn) => 
{
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'pepe', password: '12345' })
    });
    
    const data = await response.json();
    testUtils.log(data);

    // Validamos código HTTP y propiedad semántica
    if (response.ok && data.role === 'client') 
    {
        testUtils.setSuccess(btn);
    }
});

// 2. Test Login - Password Incorrecto (Código Esperado: 401 Unauthorized)
testUtils.createTestButton("Test Login - Password Incorrecto (pepe y 123)", async (btn) => 
{
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'pepe', password: '123' })
    });
    
    const data = await response.json();
    testUtils.log(data);

    if (response.status === 401) 
    {
        testUtils.setSuccess(btn);
    }
});

// 3. Test Registro - Evitar Duplicados (Código Esperado: 409 Conflict)
testUtils.createTestButton("Test Registro - Evitar Duplicados (pepe)", async (btn) => 
{
    const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'pepe', password: 'Password123' })
    });
    
    const data = await response.json();
    testUtils.log(data);

    if (response.status === 409) 
    {
        testUtils.setSuccess(btn);
    }
});

// 4. Test Registro - Contraseña Corta (Código Esperado: 400 Bad Request)
testUtils.createTestButton("Test Registro - Contraseña Corta (123)", async (btn) => 
{
    const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'test_usuario_corto', password: '123' })
    });
    
    const data = await response.json();
    testUtils.log(data);

    // Verificamos que el validation_middleware interceptó la petición
    if (response.status === 400) 
    {
        testUtils.setSuccess(btn);
    }
});