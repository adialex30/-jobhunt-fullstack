const db = require('../config/db');

const UserModel = {
  async create({ name, email, password, role }) {
    const insertQuery = `
      INSERT INTO users (name, email, password, role)
      VALUES (?, ?, ?, ?)
    `;
    const [executionResult] = await db.query(insertQuery, [name, email, password, role]);
    return executionResult.insertId;
  },

  async findByEmail(email) {
    const selectQuery = `
      SELECT id, name, email, password, role, created_at
      FROM users
      WHERE email = ?
    `;
    const [matchingRows] = await db.query(selectQuery, [email]);
    return matchingRows.length > 0 ? matchingRows[0] : null;
  },

  async findById(id) {
    const selectQuery = `
      SELECT id, name, email, role, created_at
      FROM users
      WHERE id = ?
    `;
    const [matchingRows] = await db.query(selectQuery, [id]);
    return matchingRows.length > 0 ? matchingRows[0] : null;
  },

  async findAll() {
    const selectQuery = `
      SELECT id, name, email, role, created_at
      FROM users
      ORDER BY created_at DESC
    `;
    const [userRows] = await db.query(selectQuery);
    return userRows;
  },

  async update(id, { name, role }) {
    const updateQuery = `
      UPDATE users
      SET name = COALESCE(?, name),
          role = COALESCE(?, role)
      WHERE id = ?
    `;
    const [updateResult] = await db.query(updateQuery, [name, role, id]);
    return updateResult.affectedRows > 0;
  },

  async delete(id) {
    const deleteQuery = `
      DELETE FROM users
      WHERE id = ?
    `;
    const [deleteResult] = await db.query(deleteQuery, [id]);
    return deleteResult.affectedRows > 0;
  }
};

module.exports = UserModel;
