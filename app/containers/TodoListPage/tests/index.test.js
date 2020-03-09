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
  waitForElementToBeRemoved,
  wait,
} from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { MockedProvider } from '@apollo/react-testing';

import { TodoListPage } from '../index';
import { DEFAULT_LOCALE } from '../../../i18n';

import {
  GET_TODOS_QUERY,
  DELETE_TODO_MUTATION,
  TOGGLE_TODO_MUTATION,
  // ADD_TODO_MUTATION,
  // EDIT_TODO_MUTATION,
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

      expect(queryAllByRole('button').length).toBe(9);
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

      expect(queryAllByRole('button').length).toBe(6);
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
