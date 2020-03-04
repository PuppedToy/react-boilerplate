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
        expect(controller.ping()).toBe('ping');
      });
    });

    describe('Add to do', () => {
      it('should exist in controller', () => {
        expect(controller).toHaveProperty('addTodo');
      });

      it('should accept an object with title and return an object with the same title', () => {
        const newTodo = {
          title: 'Do something new',
        };

        expect(controller.addTodo(newTodo)).toHaveProperty(
          'title',
          newTodo.title,
        );
      });

      it('should generate a numeric id and attach it to the response', () => {
        const newTodo = {
          title: 'Do something new',
        };

        const resultTodo = controller.addTodo(newTodo);

        expect(resultTodo).toHaveProperty('id');
        const { id } = resultTodo;
        expect(typeof id).toBe('number');
      });

      it('should generate sequential ids for different items', () => {
        const todo1 = {
          title: 'Do something new',
        };
        const todo2 = {
          title: 'Do another new thing',
        };

        const resultTodo1 = controller.addTodo(todo1);
        const resultTodo2 = controller.addTodo(todo2);

        expect(resultTodo2.id).toBe(resultTodo1.id + 1);
      });
    });

    describe('Get to do', () => {
      it('should exist in controller', () => {
        expect(controller).toHaveProperty('getTodo');
      });
    });
  });
});
