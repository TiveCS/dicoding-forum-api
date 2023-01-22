const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AddedThread = require('../../Domains/threads/entities/AddedThread');
const ThreadDetails = require('../../Domains/threads/entities/ThreadDetails');
const ThreadsTableTestHelper = require('../../../tests/ThreadsTableTestHelper');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(newThread) {
    const { title, body, owner } = newThread;

    const id = `thread-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, title, body, owner],
    };

    const result = await this._pool.query(query);

    return new AddedThread({ ...newThread, id: result.rows[0].id });
  }

  async getThreadById(id) {
    const query = {
      text: `
      SELECT threads.id, threads.title, threads.body, users.username, threads.created_at
      FROM threads JOIN users
      ON users.id = threads.owner WHERE threads.id = $1`,
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Thread tidak ditemukan');
    }

    const commentQuery = {
      text: `
      SELECT comments.id, comments.content, users.username, comments.created_at, comments.deleted_at 
      FROM comments
      JOIN users ON comments.owner = users.id
      WHERE comments.thread_id = $1
      `,
      values: [id],
    };

    const commentResult = await this._pool.query(commentQuery);

    const thread = result.rows[0];
    const comments = commentResult.rows.map((comment) => ({
      id: comment.id,
      content:
        comment.deleted_at === null
          ? comment.content
          : '**komentar telah dihapus**',
      username: comment.username,
      date: comment.created_at,
    }));

    const threadDetails = {
      id: thread.id,
      title: thread.title,
      body: thread.body,
      date: thread.created_at,
      username: thread.username,
      comments: comments ? comments : [],
    };

    return new ThreadDetails(threadDetails);
  }

  async verifyThreadIsExist(id) {
    const query = {
      text: 'SELECT id FROM threads WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Thread tidak ditemukan');
    }
  }
}

module.exports = ThreadRepositoryPostgres;
