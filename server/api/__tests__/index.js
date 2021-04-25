const request = require('supertest');

jest.mock('../db');
const app = require('..');

describe('API', () => {
  it('Should return status 200 return on GET /alive', () =>
    request(app)
      .get('/alive')
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe('true');
      }));

  it('Should return status 200 on GET /graphql', () =>
    request(app)
      .get('/graphql')
      .set('Accept', 'text/html')
      .then(response => {
        expect(response.statusCode).toBe(200);
      }));
});
