class DeleteCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload, owner) {
    const { commentId } = useCasePayload;

    await this._commentRepository.verifyCommentOwner(commentId, owner);

    const deletedComment = await this._commentRepository.deleteCommentById(
      commentId,
    );

    return deletedComment;
  }
}

module.exports = DeleteCommentUseCase;
