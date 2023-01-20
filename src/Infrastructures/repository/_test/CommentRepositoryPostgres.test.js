const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const pool = require('../../database/postgres/pool');

describe('CommentRepository postgres', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
  });

  describe('addComment function', () => {
    it('should persist add comment and return added comment correctly', async () => {
      // Arrange
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );
      const threadId = 'thread-123';
      const owner = 'user-123';
      const newComment = {
        content: 'sebuah comment',
        threadId,
        owner,
      };

      // Action
      await commentRepositoryPostgres.addComment(newComment);

      // Assert
      const comment = await CommentsTableTestHelper.findCommentById(
        'comment-123',
      );

      expect(comment).toBeDefined();
      expect(comment.id).toEqual('comment-123');
      expect(comment.content).toEqual('sebuah comment');
      expect(comment.owner).toEqual(owner);
    });
  });

  describe('getCommentById function', () => {
    it('should throw NotFoundError when comment not found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.getCommentById('comment-123'),
      ).rejects.toThrowError('Comment tidak ditemukan');
    });

    it('should return comment correctly', async () => {
      // Arrange
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      const newComment = {
        content: 'sebuah comment',
        threadId: 'thread-123',
        owner: 'user-123',
      };

      await commentRepositoryPostgres.addComment(newComment);

      // Action
      const comment = await commentRepositoryPostgres.getCommentById(
        'comment-123',
      );

      // Assert
      expect(comment).toBeDefined();
      expect(comment.id).toEqual('comment-123');
      expect(comment.content).toEqual('sebuah comment');
      expect(comment.thread_id).toEqual('thread-123');
      expect(comment.owner).toEqual('user-123');
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should throw NotFoundError when comment not found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-123'),
      ).rejects.toThrowError('Comment tidak ditemukan');
    });

    it('should throw AuthorizationError when comment owner not match', async () => {
      // Arrange
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      const newComment = {
        content: 'sebuah comment',
        threadId: 'thread-123',
        owner: 'user-123',
      };

      await commentRepositoryPostgres.addComment(newComment);

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-456'),
      ).rejects.toThrowError('Anda tidak berhak mengakses resource ini');
    });

    it('should not throw error when comment owner match', async () => {
      // Arrange
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      const newComment = {
        content: 'sebuah comment',
        threadId: 'thread-123',
        owner: 'user-123',
      };

      await commentRepositoryPostgres.addComment(newComment);

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-123'),
      ).resolves.not.toThrowError();
    });
  });

  describe('deleteCommentById function', () => {
    it('should throw NotFoundError when comment not found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.deleteCommentById('comment-123'),
      ).rejects.toThrowError('Comment tidak ditemukan');
    });

    it('should persist delete comment', async () => {
      // Arrange
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      const newComment = {
        content: 'sebuah comment',
        threadId: 'thread-123',
        owner: 'user-123',
      };

      await commentRepositoryPostgres.addComment(newComment);

      // Action
      await commentRepositoryPostgres.deleteCommentById('comment-123');

      // Assert
      const comment = await CommentsTableTestHelper.findCommentById(
        'comment-123',
      );

      expect(comment).not.toBeDefined();
    });
  });

  describe('getCommentsByThreadId function', () => {});
});
