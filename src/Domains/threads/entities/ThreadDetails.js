class ThreadDetails {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, title, body, username, date, comments } = payload;

    this.id = id;
    this.title = title;
    this.body = body;
    this.username = username;
    this.date = date;
    this.comments = comments;
  }

  _verifyPayload({ id, title, body, username, date, comments }) {
    if (!id || !title || !body || !username || !date || !comments) {
      throw new Error('THREAD_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string' ||
      typeof title !== 'string' ||
      typeof body !== 'string' ||
      typeof username !== 'string' ||
      typeof date !== 'object' ||
      typeof comments !== 'object'
    ) {
      throw new Error('THREAD_DETAILS.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = ThreadDetails;
