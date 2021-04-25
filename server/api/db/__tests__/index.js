const databaseMethods = require('..');
const { closeDatabase } = require('../../utils/getDatabase');

describe('Index database', () => {
  beforeAll(() => closeDatabase());

  it('Should be an object', () => {
    expect(typeof databaseMethods).toBe('object');
  });
});
