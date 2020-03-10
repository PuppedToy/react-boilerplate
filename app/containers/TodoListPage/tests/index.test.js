/**
 *
 * Tests for TodoListPage
 *
 * @see https://github.com/react-boilerplate/react-boilerplate/tree/master/docs/testing
 *
 */

import React from 'react';
import {
  render,
  fireEvent,
  wait,
  waitForElement,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { IntlProvider } from 'react-intl';
import { MockedProvider } from '@apollo/react-testing';

import { TodoListPage } from '../index';
import { DEFAULT_LOCALE } from '../../../i18n';

import {
  GET_TODOS_QUERY,
  DELETE_TODO_MUTATION,
  TOGGLE_TODO_MUTATION,
  EDIT_TODO_MUTATION,
  ADD_TODO_MUTATION,
} from '../queries';

const getTodosFirstFetchMockCall = {
  request: {
    query: GET_TODOS_QUERY,
  },
  result: {
    data: {
      getTodoList: [
        {
          id: 1,
          title: 'Item 1',
          done: false,
        },
        {
          id: 2,
          title: 'Item 2',
          done: true,
        },
        {
          id: 3,
          title: 'Item 3',
          done: false,
        },
      ],
    },
  },
};

const getTodosAfterDeleteMockCall = {
  request: {
    query: GET_TODOS_QUERY,
  },
  result: {
    data: {
      getTodoList: [
        {
          id: 1,
          title: 'Item 1',
          done: false,
        },
        {
          id: 3,
          title: 'Item 3',
          done: false,
        },
      ],
    },
  },
};

const deleteTodoMockCall = {
  request: {
    query: DELETE_TODO_MUTATION,
    variables: { id: 2 },
  },
  result: {
    data: {
      deleteTodo: {
        id: 2,
        title: 'Item 2',
        done: true,
      },
    },
  },
};

const toggleTodoMockCall = {
  request: {
    query: TOGGLE_TODO_MUTATION,
    variables: { id: 1 },
  },
  result: {
    data: {
      toggleTodo: {
        id: 1,
        title: 'Item 1',
        done: true,
      },
    },
  },
};

const getTodosAfterToggleMockCall = {
  request: {
    query: GET_TODOS_QUERY,
  },
  result: {
    data: {
      getTodoList: [
        {
          id: 1,
          title: 'Item 1',
          done: true,
        },
        {
          id: 2,
          title: 'Item 2',
          done: true,
        },
        {
          id: 3,
          title: 'Item 3',
          done: false,
        },
      ],
    },
  },
};

const editTodoMockCall = {
  request: {
    query: EDIT_TODO_MUTATION,
    variables: { id: 2, title: 'Edited Item 2' },
  },
  result: {
    data: {
      editTodo: {
        id: 2,
        title: 'Edited Item 2',
        done: false,
      },
    },
  },
};

const getTodosAfterEditMockCall = {
  request: {
    query: GET_TODOS_QUERY,
  },
  result: {
    data: {
      getTodoList: [
        {
          id: 1,
          title: 'Item 1',
          done: false,
        },
        {
          id: 2,
          title: 'Edited Item 2',
          done: true,
        },
        {
          id: 3,
          title: 'Item 3',
          done: false,
        },
      ],
    },
  },
};

const addTodoMockCall = {
  request: {
    query: ADD_TODO_MUTATION,
    variables: { title: 'New item' },
  },
  result: {
    data: {
      addTodo: {
        id: 4,
        title: 'New item',
        done: false,
      },
    },
  },
};

const addEmptyTodoMockCall = {
  request: {
    query: ADD_TODO_MUTATION,
    variables: { title: '' },
  },
  result: {
    data: {
      addTodo: {
        id: 4,
        title: '',
        done: false,
      },
    },
  },
};

const getTodosAfterAddMockCall = {
  request: {
    query: GET_TODOS_QUERY,
  },
  result: {
    data: {
      getTodoList: [
        {
          id: 1,
          title: 'Item 1',
          done: false,
        },
        {
          id: 2,
          title: 'Edited Item 2',
          done: true,
        },
        {
          id: 3,
          title: 'Item 3',
          done: false,
        },
        {
          id: 4,
          title: 'New item',
          done: false,
        },
      ],
    },
  },
};

describe('<TodoListPage />', () => {
  it('Expect to not log errors in console', () => {
    const spy = jest.spyOn(global.console, 'error');

    render(
      <IntlProvider locale={DEFAULT_LOCALE}>
        <MockedProvider
          mocks={[getTodosFirstFetchMockCall]}
          addTypename={false}
        >
          <TodoListPage />
        </MockedProvider>
      </IntlProvider>,
    );
    expect(spy).not.toHaveBeenCalled();
  });

  describe('Unit testing with mocked Apollo server', () => {
    it('Expect to load todos', async () => {
      const { queryAllByRole } = render(
        <IntlProvider locale={DEFAULT_LOCALE}>
          <MockedProvider
            mocks={[getTodosFirstFetchMockCall]}
            addTypename={false}
          >
            <TodoListPage />
          </MockedProvider>
        </IntlProvider>,
      );
      await wait();

      expect(queryAllByRole('button').length).toBe(10);
    });

    it('Expect to successfully delete a todo after clicking the delete button', async () => {
      const mocks = [
        getTodosFirstFetchMockCall,
        deleteTodoMockCall,
        getTodosAfterDeleteMockCall,
      ];
      const { getByTestId, queryAllByRole } = render(
        <IntlProvider locale={DEFAULT_LOCALE}>
          <MockedProvider mocks={mocks} addTypename={false}>
            <TodoListPage />
          </MockedProvider>
        </IntlProvider>,
      );
      await wait();

      await fireEvent.click(getByTestId('delete-2'));

      await waitForElementToBeRemoved(() => getByTestId('todo-2'));

      expect(queryAllByRole('button').length).toBe(7);
    });

    it('Expect to successfully toggle a todo after clicking the toggle button', async () => {
      const mocks = [
        getTodosFirstFetchMockCall,
        toggleTodoMockCall,
        getTodosAfterToggleMockCall,
      ];
      const { getByTestId } = render(
        <IntlProvider locale={DEFAULT_LOCALE}>
          <MockedProvider mocks={mocks} addTypename={false}>
            <TodoListPage />
          </MockedProvider>
        </IntlProvider>,
      );
      await wait();

      await fireEvent.click(getByTestId('toggle-1'));

      // Fail if src attribute does not change after toggling
      await wait(() => {
        const element = getByTestId('toggle-1');
        if (element.getAttribute('src') === '/false') throw new Error();
      });
    });

    it('Expect to successfully click an item and edit it', async () => {
      const newValue = editTodoMockCall.result.data.editTodo.title;
      const mocks = [
        getTodosFirstFetchMockCall,
        editTodoMockCall,
        getTodosAfterEditMockCall,
      ];
      const { getByTestId, getByText } = render(
        <IntlProvider locale={DEFAULT_LOCALE}>
          <MockedProvider mocks={mocks} addTypename={false}>
            <TodoListPage />
          </MockedProvider>
        </IntlProvider>,
      );
      await wait();

      await fireEvent.click(getByTestId('todo-2'));

      await waitForElement(() => getByTestId('editInput-2'));

      await fireEvent.change(getByTestId('editInput-2'), {
        target: { value: newValue },
      });

      await fireEvent.keyDown(getByTestId('editInput-2'), {
        key: 'Enter',
        keyCode: 13,
      });

      await waitForElement(() => getByTestId('todo-2') && getByText(newValue));
    });

    it('Expect to successfully add a new todo', async () => {
      const newValue = addTodoMockCall.request.variables.title;
      const mocks = [
        getTodosFirstFetchMockCall,
        addTodoMockCall,
        getTodosAfterAddMockCall,
      ];
      const { getByTestId } = render(
        <IntlProvider locale={DEFAULT_LOCALE}>
          <MockedProvider mocks={mocks} addTypename={false}>
            <TodoListPage />
          </MockedProvider>
        </IntlProvider>,
      );
      await wait();

      await fireEvent.change(getByTestId('add-todo-input'), {
        target: { value: newValue },
      });
      await fireEvent.click(getByTestId('add-todo-button'));

      const newTodo = await waitForElement(() => getByTestId('todo-4'));
      expect(newTodo).toHaveTextContent(newValue);
    });

    it('Expect to empty add todo input when added', async () => {
      const newValue = addTodoMockCall.request.variables.title;
      const mocks = [
        getTodosFirstFetchMockCall,
        addTodoMockCall,
        getTodosAfterAddMockCall,
      ];
      const { getByTestId } = render(
        <IntlProvider locale={DEFAULT_LOCALE}>
          <MockedProvider mocks={mocks} addTypename={false}>
            <TodoListPage />
          </MockedProvider>
        </IntlProvider>,
      );
      await wait();

      await fireEvent.change(getByTestId('add-todo-input'), {
        target: { value: newValue },
      });
      await fireEvent.click(getByTestId('add-todo-button'));

      expect(getByTestId('add-todo-input')).toHaveValue('');
    });

    it('Expect to add todo after hitting enter', async () => {
      const newValue = addTodoMockCall.request.variables.title;
      const mocks = [
        getTodosFirstFetchMockCall,
        addTodoMockCall,
        getTodosAfterAddMockCall,
      ];
      const { getByTestId } = render(
        <IntlProvider locale={DEFAULT_LOCALE}>
          <MockedProvider mocks={mocks} addTypename={false}>
            <TodoListPage />
          </MockedProvider>
        </IntlProvider>,
      );
      await wait();

      await fireEvent.change(getByTestId('add-todo-input'), {
        target: { value: newValue },
      });
      await fireEvent.keyDown(getByTestId('add-todo-input'), {
        key: 'Enter',
        keyCode: 13,
      });

      const newTodo = await waitForElement(() => getByTestId('todo-4'));
      expect(newTodo).toHaveTextContent(newValue);
    });

    it('Expect to not add a todo if input is blank', async () => {
      const mocks = [
        getTodosFirstFetchMockCall,
        addEmptyTodoMockCall,
        getTodosAfterAddMockCall,
      ];
      const { getByTestId, queryByTestId } = render(
        <IntlProvider locale={DEFAULT_LOCALE}>
          <MockedProvider mocks={mocks} addTypename={false}>
            <TodoListPage />
          </MockedProvider>
        </IntlProvider>,
      );
      await wait();

      await fireEvent.click(getByTestId('add-todo-button'));

      await wait(() => {}, { timeout: 200 });
      expect(queryByTestId('todo-4')).toBe(null);
    });

    it('Should render and match the snapshot', async () => {
      const {
        container: { firstChild },
      } = render(
        <IntlProvider locale={DEFAULT_LOCALE}>
          <MockedProvider
            mocks={[getTodosFirstFetchMockCall]}
            addTypename={false}
          >
            <TodoListPage />
          </MockedProvider>
        </IntlProvider>,
      );
      await wait();

      expect(firstChild).toMatchSnapshot();
    });
  });
});
