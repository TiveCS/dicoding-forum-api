const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetThreadDetailsUseCase = require('../GetThreadDetailsUseCase');

describe('GetThreadDetailsUseCase', () => {
  it('should orchestrating the get thread details action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
    };

    const expectedThreadDetails = {
      id: 'thread-123',
      title: 'Dicoding Indonesia',
      body: 'Dicoding Indonesia adalah platform belajar online terbesar di Indonesia',
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

    const mockThreadRepository = new ThreadRepository();

    // Mocking
    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedThreadDetails));

    const getThreadDetailsUseCase = new GetThreadDetailsUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const threadDetails = await getThreadDetailsUseCase.execute(useCasePayload);

    // Assert
    expect(threadDetails).toStrictEqual(expectedThreadDetails);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCasePayload);
  });
});
