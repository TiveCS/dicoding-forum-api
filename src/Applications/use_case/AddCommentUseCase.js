const AddedComment = require('../../Domains/comments/entities/AddedComment');
const NewComment = require('../../Domains/comments/entities/NewComment');

class AddCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload, owner) {
    const newComment = new NewComment({ ...useCasePayload, owner });
    const addedComment = await this._commentRepository.addComment(newComment);
    return addedComment;
  }
}

module.exports = AddCommentUseCase;
