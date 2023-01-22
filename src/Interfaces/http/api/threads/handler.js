const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const GetThreadDetailsUseCase = require('../../../../Applications/use_case/GetThreadDetailsUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadHandler = this.getThreadHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);

    const payload = {
      ...request.payload,
      owner: request.auth.credentials.id,
    };

    const addedThread = await addThreadUseCase.execute(payload);

    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async getThreadHandler(request, h) {
    const { threadId } = request.params;

    const getThreadDetailsUseCase = this._container.getInstance(
      GetThreadDetailsUseCase.name,
    );

    const thread = await getThreadDetailsUseCase.execute(threadId);

    return {
      status: 'success',
      data: {
        thread,
      },
    };
  }
}

module.exports = ThreadsHandler;
