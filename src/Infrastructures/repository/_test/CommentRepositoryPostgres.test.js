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
      const newComment = {
        content: 'sebuah comment',
        threadId: 'thread-123',
        owner: 'user-123',
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
      expect(comment.thread_id).toEqual('thread-123');
      expect(comment.owner).toEqual('user-123');
    });
  });
});
