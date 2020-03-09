/**
 *
 * Tests for TodoListPage
 *
 * @see https://github.com/react-boilerplate/react-boilerplate/tree/master/docs/testing
 *
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { MockedProvider } from '@apollo/react-testing';
import wait from 'waait';

import { TodoListPage } from '../index';
import { DEFAULT_LOCALE } from '../../../i18n';

import {
  GET_TODOS_QUERY,
  // ADD_TODO_QUERY,
  // DELETE_TODO_QUERY,
  // TOGGLE_TODO_QUERY,
  // EDIT_TODO_QUERY,
} from '../queries';

const STATE_CLEAN = 0;
const STATE_DELETED = 1;
let testState = STATE_CLEAN;

const basicMocks = [
  {
    request: {
      query: GET_TODOS_QUERY,
    },
    result: () => {
      switch (testState) {
        case STATE_CLEAN:
          return {
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
          };
        case STATE_DELETED:
          return {
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
          };
        default:
          return {};
      }
    },
  },
];

describe('<TodoListPage />', () => {
  it('Expect to not log errors in console', () => {
    const spy = jest.spyOn(global.console, 'error');

    render(
      <IntlProvider locale={DEFAULT_LOCALE}>
        <MockedProvider mocks={basicMocks} addTypename={false}>
          <TodoListPage />
        </MockedProvider>
      </IntlProvider>,
    );
    expect(spy).not.toHaveBeenCalled();
  });

  describe('Unit testing with mocked Apollo server', () => {
    beforeEach(() => {
      testState = STATE_CLEAN;
    });

    it('Expect to load todos', async () => {
      const { queryAllByRole } = render(
        <IntlProvider locale={DEFAULT_LOCALE}>
          <MockedProvider mocks={basicMocks} addTypename={false}>
            <TodoListPage />
          </MockedProvider>
        </IntlProvider>,
      );
      await wait(0);

      expect(queryAllByRole('button').length).toBe(9);
    });

    it('Expect to successfully delete a todo after clicking the delete button', async () => {
      const { getByTestId, queryByTestId, queryAllByRole } = render(
        <IntlProvider locale={DEFAULT_LOCALE}>
          <MockedProvider mocks={basicMocks} addTypename={false}>
            <TodoListPage />
          </MockedProvider>
        </IntlProvider>,
      );
      await wait(0);

      fireEvent.click(getByTestId('delete-2'));
      await wait(0);

      expect(queryByTestId('todo-2')).toBe(null);
      expect(queryAllByRole('button').length).toBe(6);
    });

    it('Should render and match the snapshot', async () => {
      const {
        container: { firstChild },
      } = render(
        <IntlProvider locale={DEFAULT_LOCALE}>
          <MockedProvider mocks={basicMocks} addTypename={false}>
            <TodoListPage />
          </MockedProvider>
        </IntlProvider>,
      );
      await wait(0);

      expect(firstChild).toMatchSnapshot();
    });
  });
});
