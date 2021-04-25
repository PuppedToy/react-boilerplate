const {
  getDatabase,
  closeDatabase,
  connectDatabase,
} = require('../getDatabase');

describe('Database setup methods', () => {
  afterAll(() => closeDatabase());

  describe('getDatabase', () => {
    beforeAll(() => closeDatabase().then(() => connectDatabase()));

    it('Should return a not null object', () =>
      new Promise((resolve, reject) => {
        getDatabase()
          .then(db => {
            expect(db).not.toBeNull();
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      }));

    it('Should allow queries if the first parameter is a string', () =>
      new Promise((resolve, reject) => {
        getDatabase('collection')
          .then(db => db.insertOne({ foo: 'bar' }))
          .then(result => {
            expect(result).not.toBeNull();
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      }));

    it('Should not allow queries if the first parameter is not a string', () =>
      new Promise((resolve, reject) => {
        getDatabase([])
          .then(() => {
            reject(new Error('Should have thrown an error'));
          })
          .catch(error => {
            expect(error).toBeInstanceOf(Error);
            resolve();
          });
      }));
  });

  describe('closeDatabase', () => {
    beforeAll(() => closeDatabase());

    it('Should stop connections after being executed', () =>
      new Promise((resolve, reject) => {
        connectDatabase()
          .then(() => closeDatabase())
          .catch(error => {
            reject(error);
          })
          .then(() => getDatabase('collection'))
          .then(() => {
            reject(new Error('Should have thrown an error'));
          })
          .catch(() => {
            resolve();
          });
      }));

    it('Should not throw an error if called when the database is already close', () =>
      new Promise((resolve, reject) => {
        connectDatabase()
          .then(() => closeDatabase())
          .then(() => closeDatabase())
          .then(() => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      }));
  });

  describe('connectDatabase', () => {
    beforeAll(() => closeDatabase());

    it('Connecting the database should return an object', () =>
      new Promise((resolve, reject) => {
        connectDatabase()
          .then(db => {
            expect(typeof db).toBe('object');
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      }));

    it('Should throw an error if the database is already connected', () =>
      new Promise((resolve, reject) => {
        connectDatabase()
          .then(() => connectDatabase())
          .then(() => {
            reject(new Error('Should have thrown an error'));
          })
          .catch(error => {
            expect(error).toBeInstanceOf(Error);
            resolve();
          });
      }));
  });
});
