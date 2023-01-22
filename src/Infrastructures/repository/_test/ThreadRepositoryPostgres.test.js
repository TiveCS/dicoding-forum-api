const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const pool = require('../../database/postgres/pool');

describe('ThreadRepository postgres', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  describe('getThreadById function', () => {
    it('should throw NotFoundError when thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        threadRepositoryPostgres.getThreadById('thread-123'),
      ).rejects.toThrowError(NotFoundError);
    });

    it('should return thread correctly', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
      });

      await UsersTableTestHelper.addUser({
        id: 'user-456',
        username: 'johndoe',
        fullname: 'John Doe',
      });

      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'sebuah thread',
        body: 'sebuah body',
        owner: 'user-123',
      });

      const expectedThreadDetails = {
        id: 'thread-123',
        title: 'sebuah thread',
        body: 'sebuah body',
        date: '2021-08-08T07:07:07.000Z',
        username: 'dicoding',
        comments: [
          {
            id: 'comment-123',
            username: 'dicoding',
            date: '2021-08-08T07:07:07.000Z',
            content: 'ini comment',
          },
          {
            id: 'comment-456',
            username: 'johndoe',
            date: '2021-08-08T07:07:07.000Z',
            content: '**komentar telah dihapus**',
          },
        ],
      };

      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        content: 'ini comment',
        threadId: 'thread-123',
        owner: 'user-123',
      });

      await CommentsTableTestHelper.addComment({
        id: 'comment-456',
        content: 'ini comment',
        threadId: 'thread-123',
        owner: 'user-456',
      });

      await CommentsTableTestHelper.softDeleteCommentById('comment-456');

      // Action
      const thread = await threadRepositoryPostgres.getThreadById('thread-123');

      // Assert
      expect(thread).toBeDefined();
      expect(thread.id).toEqual(expectedThreadDetails.id);
      expect(thread.title).toEqual(expectedThreadDetails.title);
      expect(thread.body).toEqual(expectedThreadDetails.body);
      expect(thread.username).toEqual(expectedThreadDetails.username);
      expect(thread.comments).toBeDefined();
    });
  });

  describe('verifyThreadIsExist function', () => {
    it('should throw NotFoundError when thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        threadRepositoryPostgres.verifyThreadIsExist('thread-123'),
      ).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when thread is exist', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'sebuah thread',
        body: 'sebuah body',
        owner: 'user-123',
      });

      // Action & Assert
      await expect(
        threadRepositoryPostgres.verifyThreadIsExist('thread-123'),
      ).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('addThread function', () => {
    it('should persist add thread and return added thread correctly', async () => {
      // Arrange
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );
      const newThread = {
        title: 'sebuah thread',
        body: 'sebuah body',
        owner: 'user-123',
      };

      // Action
      await threadRepositoryPostgres.addThread(newThread);

      // Assert
      const thread = await ThreadsTableTestHelper.findThreadById('thread-123');
      expect(thread.id).toEqual('thread-123');
      expect(thread.title).toEqual('sebuah thread');
      expect(thread.body).toEqual('sebuah body');
      expect(thread.owner).toEqual('user-123');
    });
  });
});
