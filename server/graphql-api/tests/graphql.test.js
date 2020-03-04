const request = require('supertest');
const app = require('../..');
const controller = require('../controller');

describe('GraphQL Server', () => {
  describe('GraphQL API Integration', () => {
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
          expect(response).toHaveProperty('body');
          const { body } = response;
          expect(body).toHaveProperty('data');
          const { data } = body;
          expect(data).toHaveProperty('ping', 'ping');
          done();
        });
    });
  });

  describe('GraphQL Controller', () => {
    describe('Ping service', () => {
      it('should just return ping', () => {
        expect(controller).toHaveProperty('ping');
        expect(controller.ping()).toBe('string');
      });
    });
  });
});
