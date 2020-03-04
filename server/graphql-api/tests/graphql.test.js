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
    beforeEach(() => {
      controller.reset();
    });

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

      it('should generate done field initialized as false and attach it to the response', () => {
        const newTodo = {
          title: 'Do something new',
        };

        const resultTodo = controller.addTodo(newTodo);
        expect(resultTodo).toHaveProperty('done', false);
      });
    });

    describe('Get to do list', () => {
      it('should exist in controller', () => {
        expect(controller).toHaveProperty('getTodoList');
      });

      it('should return an empty list if is called before any addTodo', () => {
        const result = controller.getTodoList();
        expect(result instanceof Array).toBeTruthy();
        expect(result.length).toBe(0);
      });

      it('should return a list with the same item that was returned with a addTodo', () => {
        const newTodo = {
          title: 'Do something new',
        };

        const resultTodo = controller.addTodo(newTodo);
        const todoList = controller.getTodoList();
        expect(todoList instanceof Array).toBeTruthy();
        expect(todoList.length).toBe(1);
        expect(todoList[0]).toEqual(resultTodo);
      });

      it('should still return an empty list if returned list is edited', () => {
        const todoList = controller.getTodoList();
        todoList.push('item');
        const todoListAfterEdition = controller.getTodoList();

        expect(todoListAfterEdition instanceof Array).toBeTruthy();
        expect(todoListAfterEdition.length).toBe(0);
      });

      it('should match the expected result for a given list', () => {
        const todosToAdd = [
          { title: 'Item 1' },
          { title: 'Item 2' },
          { title: 'Item 3' },
          { title: 'Item 4' },
          { title: 'Item 5' },
        ];
        const expectedResult = [
          { title: 'Item 1', id: 1, done: false },
          { title: 'Item 2', id: 2, done: false },
          { title: 'Item 3', id: 3, done: false },
          { title: 'Item 4', id: 4, done: false },
          { title: 'Item 5', id: 5, done: false },
        ];

        todosToAdd.forEach(todo => {
          controller.addTodo(todo);
        });

        const todoList = controller.getTodoList();
        expect(todoList instanceof Array).toBeTruthy();
        expect(todoList.length).toBe(5);
        expect(todoList).toEqual(expectedResult);
      });

      it('should match the expected result for a given list after a toggle', () => {
        const todosToAdd = [
          { title: 'Item 1' },
          { title: 'Item 2' },
          { title: 'Item 3' },
        ];
        const todoToToggle = {
          id: 2,
        };
        const expectedResult = [
          { title: 'Item 1', id: 1, done: false },
          { title: 'Item 2', id: 2, done: true },
          { title: 'Item 3', id: 3, done: false },
        ];

        todosToAdd.forEach(todo => {
          controller.addTodo(todo);
        });
        controller.toggleTodo(todoToToggle);
        const result = controller.getTodoList();

        expect(result).toEqual(expectedResult);
      });
    });

    describe('Toggle to do', () => {
      it('should exist in controller', () => {
        expect(controller).toHaveProperty('toggleTodo');
      });

      it('should throw an error if the id does not exist', () => {
        expect(() => {
          controller.toggleTodo({ id: 1 });
        }).toThrow();
      });

      it('should return the item with done field as true after toggling it', () => {
        const newTodo = {
          title: 'Do something new',
        };

        const { id } = controller.addTodo(newTodo);
        const resultToggle = controller.toggleTodo({ id });
        expect(resultToggle).toHaveProperty('done', true);
      });

      it('should return the same done value after toggling it twice and the same when toggling it once', () => {
        const newTodo = {
          title: 'Do something new',
        };

        const resultAddTodo = controller.addTodo(newTodo);
        const { id } = resultAddTodo;
        const resultToggle1 = controller.toggleTodo({ id });
        const resultToggle2 = controller.toggleTodo({ id });

        expect(resultToggle1).not.toEqual(resultAddTodo);
        expect(resultToggle2).toEqual(resultAddTodo);
      });
    });

    describe('Reset', () => {
      it('should exist in controller', () => {
        expect(controller).toHaveProperty('reset');
      });

      it('should make further calls to addTodo return 1 as id', () => {
        const todo1 = {
          title: 'Do something new',
        };
        const todo2 = {
          title: 'Do another new thing',
        };

        controller.addTodo(todo1);
        controller.reset();
        const resultTodo2 = controller.addTodo(todo2);

        expect(resultTodo2.id).toBe(1);
      });

      it('should make next getTodoList call to return an empty list', () => {
        const newTodo = {
          title: 'Do something new',
        };

        controller.addTodo(newTodo);
        controller.reset();
        const todoList = controller.getTodoList();
        expect(todoList instanceof Array).toBeTruthy();
        expect(todoList.length).toBe(0);
      });
    });
  });
});
