const ThreadDetails = require('../ThreadDetails');

describe('a ThreadDetails entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'sebuah thread',
      body: 'ini adalah body dari sebuah thread',
      username: 'dicoding',
    };

    // Action and Assert
    expect(() => new ThreadDetails(payload)).toThrowError(
      'THREAD_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      title: 123,
      body: 123,
      username: 123,
      date: 123,
      comments: 123,
    };

    // Action and Assert
    expect(() => new ThreadDetails(payload)).toThrowError(
      'THREAD_DETAILS.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });
});
