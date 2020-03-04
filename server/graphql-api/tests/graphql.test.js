const request = require('supertest');
const app = require('../..');

describe('GraphQL Server', () => {
  it('should expose graphql playground', done => {
    request(app)
      .get('/graphql')
      .set('Accept', 'text/html')
      .expect(200, done);
  });

  it('should return ping after a graphql ping query', done => {
    request(app)
      .post('/graphql')
      .send({ query: '{\n  ping\n}', variables: null })
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200)
      .then(response => {
        expect(response).toHaveProperty('data');
        const { data } = response;
        expect(typeof data).toBe('object');
        expect(data).toHaveProperty('ping', 'ping');
        done();
      });
  });
});
