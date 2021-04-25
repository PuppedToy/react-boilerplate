jest.mock('../../../db');

const indexMethods = require('..');
const login = require('../login');
const getUser = require('../getUser');
const createUser = require('../createUser');

describe('Users API methods', () => {
  describe('index', () => {
    it('Should be an object', () => {
      expect(typeof indexMethods).toBe('object');
    });
  });

  describe('login', () => {
    it('Should return a String token if verify method returns true', () =>
      new Promise((resolve, reject) => {
        login({ name: 'foo', password: 'bar' })
          .then(token => {
            expect(token).toBeTruthy();
            expect(typeof token).toBe('string');
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      }));

    it('Should return null if verify returns false', () =>
      new Promise((resolve, reject) => {
        login({ name: 'baz', password: 'bar' })
          .then(token => {
            expect(token).toBeNull();
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      }));

    it('Should return null if verify throws an error', () =>
      new Promise((resolve, reject) => {
        login({ name: 'error', password: 'bar' })
          .then(token => {
            expect(token).toBeNull();
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      }));
  });

  describe('getUser', () => {
    it('Should not throw an error if the item has id', () =>
      new Promise((resolve, reject) => {
        getUser({ id: 'foo' })
          .then(retrievedUser => {
            expect(retrievedUser).toBeTruthy();
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      }));

    it('Should throw an error if the item does not have id', () =>
      new Promise((resolve, reject) => {
        getUser({})
          .then(() => {
            reject(new Error('Should have thrown an error'));
          })
          .catch(error => {
            expect(error).toBeInstanceOf(Error);
            resolve();
          });
      }));
  });

  describe('createUser', () => {
    it('Should not throw an error if the item has id', () =>
      new Promise((resolve, reject) => {
        createUser({ name: 'foo', password: 'bar' })
          .then(result => {
            expect(result).toBe(true);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      }));

    it('Should return false if createUser db call fails', () =>
      new Promise((resolve, reject) => {
        createUser({ name: 'error', password: 'bar' })
          .then(result => {
            expect(result).toBe(false);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      }));
  });
});
