const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');
const AuthenticationTokenManager = require('../../../Applications/security/AuthenticationTokenManager');
const ThreadTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');

describe('/threads endpoints', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
  });

  describe('when GET /threads/{threadId}', () => {
    it('should response 200 and thread detail', async () => {
      // Arrange
      const requestPayload = {
        title: 'Dicoding Indonesia',
        body: 'Dicoding Indonesia',
      };
      const threadId = 'thread-123';

      const server = await createServer(container);

      ThreadTableTestHelper.addThread({
        ...requestPayload,
        id: threadId,
        owner: 'user-123',
      });

      // Action
      const responseDetail = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });

      // Assert
      const responseDetailJson = JSON.parse(responseDetail.payload);
      expect(responseDetail.statusCode).toEqual(200);
      expect(responseDetailJson.status).toEqual('success');
      expect(responseDetailJson.data.thread).toBeDefined();
    });

    it('should response 404 when thread not found', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-123',
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Thread tidak ditemukan');
    });
  });

  describe('when POST /threads', () => {
    it('should response 401 when request not contain Authorization header', async () => {
      // Arrange
      const requestPayload = {
        title: 'Dicoding Indonesia',
        body: 'Dicoding Indonesia',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 201 and persisted thread', async () => {
      // Arrange
      const requestPayload = {
        title: 'Dicoding Indonesia',
        body: 'Dicoding Indonesia',
      };
      const server = await createServer(container);
      const tokenManager = container.getInstance(
        AuthenticationTokenManager.name,
      );
      const accessToken = await tokenManager.createAccessToken({
        id: 'user-123',
      });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        title: 'Dicoding Indonesia',
      };
      const server = await createServer(container);
      const tokenManager = container.getInstance(
        AuthenticationTokenManager.name,
      );
      const accessToken = await tokenManager.createAccessToken({
        id: 'user-123',
      });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada',
      );
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        title: 123,
        body: 123,
      };

      const server = await createServer(container);
      const tokenManager = container.getInstance(
        AuthenticationTokenManager.name,
      );
      const accessToken = await tokenManager.createAccessToken({
        id: 'user-123',
      });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat membuat thread baru karena tipe data tidak sesuai',
      );
    });
  });
});
