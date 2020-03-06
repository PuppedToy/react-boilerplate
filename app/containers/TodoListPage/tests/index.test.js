/**
 *
 * Tests for TodoListPage
 *
 * @see https://github.com/react-boilerplate/react-boilerplate/tree/master/docs/testing
 *
 */

import React from 'react';
import { render } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { MockedProvider } from '@apollo/react-testing';

import { TodoListPage } from '../index';
import { DEFAULT_LOCALE } from '../../../i18n';

import {
  GET_TODOS_QUERY,
  // ADD_TODO_QUERY,
  // DELETE_TODO_QUERY,
  // TOGGLE_TODO_QUERY,
  // EDIT_TODO_QUERY,
} from '../queries';

const mocks = [
  {
    request: {
      query: GET_TODOS_QUERY,
    },
    result: () => [
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
];

describe('<TodoListPage />', () => {
  it('Expect to not log errors in console', () => {
    const spy = jest.spyOn(global.console, 'error');

    render(
      <IntlProvider locale={DEFAULT_LOCALE}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <TodoListPage />
        </MockedProvider>
      </IntlProvider>,
    );
    expect(spy).not.toHaveBeenCalled();
  });

  it('Expect to load todos', () => {
    const { queryAllByRole } = render(
      <IntlProvider locale={DEFAULT_LOCALE}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <TodoListPage />
        </MockedProvider>
      </IntlProvider>,
    );

    expect(queryAllByRole('button').length).toBe(3);
  });

  it('Should render and match the snapshot', () => {
    const {
      container: { firstChild },
    } = render(
      <IntlProvider locale={DEFAULT_LOCALE}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <TodoListPage />
        </MockedProvider>
      </IntlProvider>,
    );
    expect(firstChild).toMatchSnapshot();
  });
});
