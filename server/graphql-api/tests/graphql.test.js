const request = require('supertest');
const app = require('../..');

describe('GraphQL Server', () => {
  it('should expose graphql playground', done => {
    request(app)
      .get('/graphql')
      .set('Accept', 'text/html')
      .expect(200, done);
  });
});
