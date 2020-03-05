/**
 *
 * Tests for TodoList
 *
 * @see https://github.com/react-boilerplate/react-boilerplate/tree/master/docs/testing
 *
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
// import '@testing-library/jest-dom/extend-expect'; // add some helpful assertions

import TodoList from '../index';

describe('<TodoList />', () => {
  it('Expect to not log errors in console', () => {
    const spy = jest.spyOn(global.console, 'error');
    render(<TodoList />);
    expect(spy).not.toHaveBeenCalled();
  });

  it('Should render empty container on empty todos', () => {
    const { queryByRole } = render(<TodoList todos={[]} />);

    expect(queryByRole('button')).toBe(null);
  });

  it('Should render something when there is one todo', () => {
    const todos = [
      {
        id: 1,
        title: 'A todo',
        done: false,
      },
    ];

    const { queryByRole } = render(<TodoList todos={todos} />);

    expect(queryByRole('button')).not.toBe(null);
  });

  it('Should render and match the snapshot on empty todos', () => {
    const {
      container: { firstChild },
    } = render(<TodoList todos={[]} />);
    expect(firstChild).toMatchSnapshot();
  });

  it('Should render and match the snapshot with one todo', () => {
    const todos = [
      {
        id: 1,
        title: 'A todo',
        done: false,
      },
    ];

    const {
      container: { firstChild },
    } = render(<TodoList todos={todos} />);
    expect(firstChild).toMatchSnapshot();
  });

  it('Should render and match the snapshot with 3 todos', () => {
    const todos = [
      {
        id: 1,
        title: 'A todo',
        done: false,
      },
      {
        id: 2,
        title: 'Another todo',
        done: true,
      },
      {
        id: 3,
        title: 'Last todo',
        done: false,
      },
    ];

    const {
      container: { firstChild },
    } = render(<TodoList todos={todos} />);
    expect(firstChild).toMatchSnapshot();
  });

  it('Should render and match the snapshot with 3 todos after clicking one of them', () => {
    const todos = [
      {
        id: 1,
        title: 'A todo',
        done: false,
      },
      {
        id: 2,
        title: 'Another todo',
        done: true,
      },
      {
        id: 3,
        title: 'Last todo',
        done: false,
      },
    ];

    const {
      container: { firstChild },
      getByTestId,
    } = render(<TodoList todos={todos} />);

    fireEvent.click(getByTestId('editInput-3'));
    // @TODO Will this work? Check snapshot when fully implemented!
    expect(firstChild).toMatchSnapshot();
  });
});
