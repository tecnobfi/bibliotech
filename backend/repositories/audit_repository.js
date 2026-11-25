
const db = require('../config/db');

class AuditRepository {
  async create(userId, action, target, ipAddress = null) {
    const [rows] = await db.execute(
      'CALL sp_create_audit_log(?, ?, ?, ?)',
      [userId, action, target, ipAddress]
    );
    return rows[0][0].insertId;
  }

  async logAction(userId, action, target, ipAddress = null) {
    return this.create(userId, action, target, ipAddress);
  }

  async findAll() {
    const [rows] = await db.execute('CALL sp_find_all_audit_logs()');
    return rows[0];
  }
}

module.exports = new AuditRepository();

