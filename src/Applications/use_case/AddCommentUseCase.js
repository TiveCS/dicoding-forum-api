const AddedComment = require('../../Domains/comments/entities/AddedComment');
const NewComment = require('../../Domains/comments/entities/NewComment');

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload, owner) {
    const payload = {
      ...useCasePayload,
      owner,
    };
    const newComment = new NewComment(payload);

    await this._threadRepository.verifyThreadIsExist(newComment.threadId);

    const addedComment = await this._commentRepository.addComment(newComment);
    return addedComment;
  }
}

module.exports = AddCommentUseCase;
