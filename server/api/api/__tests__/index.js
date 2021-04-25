jest.mock('../../db');
const apiMethods = require('..');

describe('General API methods', () => {
  it('Should be an object', () => {
    expect(typeof apiMethods).toBe('object');
  });

  it('alive should return true', () => {
    const result = apiMethods.alive();

    expect(result).toBe(true);
  });

  it('token should return the userToken id if present', () => {
    const result = apiMethods.token(null, {
      userToken: {
        id: 'foo',
      },
    });

    expect(result).toBe('foo');
  });

  it('token should return undefined if userToken is not present', () => {
    const result = apiMethods.token(null, {});

    expect(result).toBe(undefined);
  });
});
