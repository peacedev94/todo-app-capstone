const { pool } = require('../config/database');

class Todo {
  static async create({ title, description, userId }) {
    const query = `
      INSERT INTO todos (title, description, user_id)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    
    const result = await pool.query(query, [title, description, userId]);
    return result.rows[0];
  }

  static async findByUserId(userId) {
    const query = `
      SELECT * FROM todos 
      WHERE user_id = $1 
      ORDER BY created_at DESC
    `;
    
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  static async findById(id, userId) {
    const query = 'SELECT * FROM todos WHERE id = $1 AND user_id = $2';
    const result = await pool.query(query, [id, userId]);
    return result.rows[0];
  }

  static async update(id, userId, updates) {
    const { title, description, completed } = updates;
    
    const query = `
      UPDATE todos 
      SET title = COALESCE($1, title),
          description = COALESCE($2, description),
          completed = COALESCE($3, completed),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $4 AND user_id = $5
      RETURNING *
    `;
    
    const result = await pool.query(query, [title, description, completed, id, userId]);
    return result.rows[0];
  }

  static async delete(id, userId) {
    const query = 'DELETE FROM todos WHERE id = $1 AND user_id = $2 RETURNING *';
    const result = await pool.query(query, [id, userId]);
    return result.rows[0];
  }
}

module.exports = Todo;
