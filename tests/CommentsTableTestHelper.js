/* istanbul ignore file */

const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async addComment({ id, content, owner, threadId }) {
    await pool.query({
      text: 'INSERT INTO comments(id, content, owner, thread_id) VALUES($1, $2, $3, $4)',
      values: [id, content, owner, threadId],
    });
  },

  async findCommentById(id) {
    const result = await pool.query({
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    });

    return result.rows[0];
  },

  async softDeleteCommentById(id) {
    await pool.query({
      text: 'UPDATE comments SET content = $1 WHERE id = $2',
      values: ['**komentar telah dihapus**', id],
    });
  },

  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1=1');
    await pool.query('DELETE FROM threads WHERE 1=1');
  },
};

module.exports = CommentsTableTestHelper;
