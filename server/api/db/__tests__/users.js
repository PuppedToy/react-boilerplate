const { ObjectId } = require('mongodb');
const argon2 = require('argon2');

const { getById, verify, create } = require('../users');
const {
  getDatabase,
  closeDatabase,
  connectDatabase,
} = require('../../utils/getDatabase');
const emptyDatabase = require('../../utils/testing/emptyDatabase');

describe('Users database methods', () => {
  // eslint-disable-next-line no-unused-vars
  let usersDb;

  beforeAll(() => closeDatabase().then(() => connectDatabase()));

  beforeEach(() =>
    emptyDatabase()
      .then(() => getDatabase('users'))
      .then(db => {
        // eslint-disable-next-line no-unused-vars
        usersDb = db;
      }),
  );

  afterAll(() => emptyDatabase().then(() => closeDatabase()));

  describe('getById', () => {
    beforeEach(() =>
      getDatabase('users').then(users =>
        users.insertMany([
          { _id: ObjectId('111111111111111111111111'), name: 'foo' },
          { _id: ObjectId('222222222222222222222222'), name: 'bar' },
        ]),
      ),
    );

    it('Should return foo if requested for id 111111111111111111111111', () =>
      new Promise((resolve, reject) => {
        getById('111111111111111111111111')
          .then(retrievedUser => {
            expect(retrievedUser).toHaveProperty('name', 'foo');
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      }));

    it('Should return bar if requested for id 222222222222222222222222', () =>
      new Promise((resolve, reject) => {
        getById('222222222222222222222222')
          .then(retrievedUser => {
            expect(retrievedUser).toHaveProperty('name', 'bar');
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      }));

    it('Should return null if requested for id 444444444444444444444444', () =>
      new Promise((resolve, reject) => {
        getById('444444444444444444444444')
          .then(retrievedUser => {
            expect(retrievedUser).toBeNull();
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      }));
  });

  describe('verify', () => {
    beforeEach(() =>
      Promise.all([
        getDatabase('users'),
        argon2.hash('baz'),
        argon2.hash('qux'),
      ]).then(([users, bazPassword, quxPassword]) =>
        users.insertMany([
          {
            _id: ObjectId('111111111111111111111111'),
            name: 'foo',
            password: bazPassword,
          },
          {
            _id: ObjectId('222222222222222222222222'),
            name: 'bar',
            password: quxPassword,
          },
        ]),
      ),
    );

    it('Should return 111111111111111111111111 user if provided foo name and baz password', () =>
      new Promise((resolve, reject) => {
        verify('foo', 'baz')
          .then(retrievedUser => {
            expect(retrievedUser).toHaveProperty(
              '_id',
              ObjectId('111111111111111111111111'),
            );
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      }));

    it('Should return 222222222222222222222222 user if provided foo name and qux password', () =>
      new Promise((resolve, reject) => {
        verify('bar', 'qux')
          .then(retrievedUser => {
            expect(retrievedUser).toHaveProperty(
              '_id',
              ObjectId('222222222222222222222222'),
            );
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      }));

    it('Should return false if provided foo name and qux password', () =>
      new Promise((resolve, reject) => {
        verify('foo', 'qux')
          .then(retrievedUser => {
            expect(retrievedUser).toBe(false);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      }));

    it('Should return false if provided foo name and quux password', () =>
      new Promise((resolve, reject) => {
        verify('foo', 'quux')
          .then(retrievedUser => {
            expect(retrievedUser).toBe(false);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      }));

    it('Should return false if provided quux name', () =>
      new Promise((resolve, reject) => {
        verify('quux', 'qux')
          .then(retrievedUser => {
            expect(retrievedUser).toBe(false);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      }));

    it('Should return false if provided no arguments', () =>
      new Promise((resolve, reject) => {
        verify()
          .then(retrievedUser => {
            expect(retrievedUser).toBe(false);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      }));
  });

  describe('create', () => {
    it('Should create a user given a name and a password', () =>
      new Promise((resolve, reject) => {
        create('foo', 'bar')
          .then(() => usersDb.findOne({ name: 'foo' }))
          .then(retrievedUser => {
            expect(retrievedUser).toHaveProperty('name', 'foo');
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      }));

    it('Should create a user with an _id', () =>
      new Promise((resolve, reject) => {
        create('foo', 'bar')
          .then(() => usersDb.findOne({ name: 'foo' }))
          .then(retrievedUser => {
            expect(retrievedUser).toHaveProperty('_id');
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      }));

    it('Should not save the password in plain', () =>
      new Promise((resolve, reject) => {
        create('foo', 'bar')
          .then(() => usersDb.findOne({ name: 'foo' }))
          .then(retrievedUser => {
            expect(retrievedUser).toHaveProperty('password');
            expect(retrievedUser).not.toHaveProperty('password', 'bar');
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      }));

    it('Should throw an error if password is not provided', () =>
      new Promise((resolve, reject) => {
        create('foo')
          .then(() => {
            reject(new Error('Should have thrown an error'));
          })
          .catch(error => {
            expect(error).toBeInstanceOf(Error);
            resolve();
          });
      }));

    it('Should not create an user if password is not provided', () =>
      new Promise((resolve, reject) => {
        create('foo')
          .catch(() => {})
          .finally(() => usersDb.findOne({ name: 'foo' }))
          .then(retrievedUser => {
            expect(retrievedUser).toBeFalsy();
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      }));

    it('Should throw an error if name is not provided', () =>
      new Promise((resolve, reject) => {
        create(null, 'bar')
          .then(() => {
            reject(new Error('Should have thrown an error'));
          })
          .catch(error => {
            expect(error).toBeInstanceOf(Error);
            resolve();
          });
      }));

    it('Should not create an user if name is not provided', () =>
      new Promise((resolve, reject) => {
        create(null, 'bar')
          .catch(() => {})
          .finally(() => usersDb.findOne({ name: null }))
          .then(retrievedUser => {
            expect(retrievedUser).toBeFalsy();
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      }));

    it('Should throw an error if name is blank', () =>
      new Promise((resolve, reject) => {
        create('', 'bar')
          .then(() => {
            reject(new Error('Should have thrown an error'));
          })
          .catch(error => {
            expect(error).toBeInstanceOf(Error);
            resolve();
          });
      }));

    it('Should not create an user if name is blank', () =>
      new Promise((resolve, reject) => {
        create('', 'bar')
          .catch(() => {})
          .finally(() => usersDb.findOne({ name: '' }))
          .then(retrievedUser => {
            expect(retrievedUser).toBeFalsy();
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      }));
  });
});
