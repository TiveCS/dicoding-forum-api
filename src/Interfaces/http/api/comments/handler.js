const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    const addCommentUseCase = this._container.getInstance(
      AddCommentUseCase.name,
    );

    const owner = request.auth.credentials.id;
    const useCasePayload = {
      content: request.payload.content,
      threadId: request.params.threadId,
    };

    const addedComment = await addCommentUseCase.execute(useCasePayload, owner);

    const response = h.response({
      status: 'success',
      message: 'Comment berhasil ditambahkan',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentHandler(request, h) {
    const deleteCommentUseCase = this._container.getInstance(
      DeleteCommentUseCase.name,
    );

    const owner = request.auth.credentials.id;
    const useCasePayload = {
      commentId: request.params.commentId,
    };

    await deleteCommentUseCase.execute(useCasePayload, owner);

    return {
      status: 'success',
    };
  }
}

module.exports = CommentsHandler;
