const jwt = require('jsonwebtoken');
const { authMiddleware } = require('../middlewares');

describe('Middlewares', () => {
  describe('authMiddleware', () => {
    let next;
    let request;
    const validToken = jwt.sign({ id: 'foo' }, process.env.JWT_SECRET);
    const incompleteToken = jwt.sign({ foo: 'bar' }, process.env.JWT_SECRET);
    const invalidToken = jwt.sign({ id: 'foo' }, 'wrong passphrase');

    beforeEach(() => {
      next = jest.fn();
      request = {
        headers: {},
      };
    });

    it('Should call next if provided a valid token', () => {
      request.headers.authorization = `Bearer ${validToken}`;
      authMiddleware(request, {}, next);
      expect(next).toHaveBeenCalled();
    });

    it('Should set isAuthorized to true if provided a valid token', () => {
      request.headers.authorization = `Bearer ${validToken}`;
      authMiddleware(request, {}, next);
      expect(request.isAuthorized).toBe(true);
    });

    it('Should set userToken to the expected object if provided a valid token', () => {
      request.headers.authorization = `Bearer ${validToken}`;
      authMiddleware(request, {}, next);
      expect(request.userToken).toHaveProperty('id', 'foo');
      expect(request.userToken).toHaveProperty('iat');
    });

    it('Should set userToken to the expected object if provided a valid token on Authorization', () => {
      request.headers.Authorization = `Bearer ${validToken}`;
      authMiddleware(request, {}, next);
      expect(request.userToken).toHaveProperty('id', 'foo');
      expect(request.userToken).toHaveProperty('iat');
    });

    it('Should set userToken to the expected object if provided a valid token with lowercase bearer', () => {
      request.headers.authorization = `bearer ${validToken}`;
      authMiddleware(request, {}, next);
      expect(request.userToken).toHaveProperty('id', 'foo');
      expect(request.userToken).toHaveProperty('iat');
    });

    it('Should set userToken to the expected object if provided a valid token on Authorization and with lowercase bearer', () => {
      request.headers.authorization = `bearer ${validToken}`;
      authMiddleware(request, {}, next);
      expect(request.userToken).toHaveProperty('id', 'foo');
      expect(request.userToken).toHaveProperty('iat');
    });

    it('Should set isAuthorized to false and userToken to null with an invalid token', () => {
      request.headers.authorization = `Bearer ${invalidToken}`;
      authMiddleware(request, {}, next);
      expect(request.isAuthorized).toBe(false);
      expect(request.userToken).toBeNull();
    });

    it('Should call next with an invalid token', () => {
      request.headers.authorization = `Bearer ${invalidToken}`;
      authMiddleware(request, {}, next);
      expect(next).toHaveBeenCalled();
    });

    it('Should set isAuthorized to false and userToken to null with no authorization header', () => {
      authMiddleware(request, {}, next);
      expect(request.isAuthorized).toBe(false);
      expect(request.userToken).toBeNull();
    });

    it('Should call next with no authorization header', () => {
      authMiddleware(request, {}, next);
      expect(next).toHaveBeenCalled();
    });

    it('Should set isAuthorized to false and userToken to null with an empty authorization header', () => {
      request.headers.authorization = '';
      authMiddleware(request, {}, next);
      expect(request.isAuthorized).toBe(false);
      expect(request.userToken).toBeNull();
    });

    it('Should set isAuthorized to false and userToken to null without the bearer', () => {
      request.headers.authorization = validToken;
      authMiddleware(request, {}, next);
      expect(request.isAuthorized).toBe(false);
      expect(request.userToken).toBeNull();
    });

    it('Should set isAuthorized to false and userToken to null with a wrong authorization format', () => {
      request.headers.authorization = `Foo ${validToken}`;
      authMiddleware(request, {}, next);
      expect(request.isAuthorized).toBe(false);
      expect(request.userToken).toBeNull();
    });

    it('Should set isAuthorized to false and userToken to null if the token does not have an id', () => {
      request.headers.authorization = `Bearer ${incompleteToken}`;
      authMiddleware(request, {}, next);
      expect(request.isAuthorized).toBe(false);
      expect(request.userToken).toBeNull();
    });
  });
});
