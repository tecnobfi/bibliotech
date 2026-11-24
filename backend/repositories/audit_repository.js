const db = require('../config/db');

class AuditRepository {
  /**
   * Asienta un evento de auditoría en la base de datos de manera no bloqueante.
   */
  async logAction(userId, action, target, ip = null) {
    db.execute('CALL sp_create_audit_log(?, ?, ?, ?)', [userId, action, target, ip])
      .catch(error => console.error('Falla al asentar evento de auditoría:', error));
  }
}

module.exports = new AuditRepository();