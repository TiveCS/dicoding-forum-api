class GetThreadDetailsUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const threadId = useCasePayload;
    const thread = await this._threadRepository.getThreadById(threadId);
    return thread;
  }
}

module.exports = GetThreadDetailsUseCase;
