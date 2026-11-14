/**
 * @file admin_tests.js
 * @brief Suite de pruebas unitarias para endpoints exclusivos de administración.
 * @project Bibliotech
 * @author Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
 * @license http://www.gnu.org/licenses/gpl.txt GNU GPL 3.0
 * @date Octubre 2026
 */

 testUtils.createTestButton("Test Admin: Listar Usuarios Registrados", async (btn) => 
 {
     // Pre-condición: Login rápido con credenciales de administrador
     const loginRes = await fetch('/api/auth/login', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ username: 'admin', password: '12345' })
     });
     
     const { token } = await loginRes.json();
 
     // Ejecución del endpoint protegido por el middleware isAdmin
     const response = await fetch('/api/admin/users', {
         headers: { 'Authorization': `Bearer ${token}` }
     });
     
     const data = await response.json();
     testUtils.log(data);
     
     if (response.ok) 
     {
         testUtils.setSuccess(btn);
     }
 });