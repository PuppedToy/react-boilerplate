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
    render(<TodoList todos={[]} />);
    expect(spy).not.toHaveBeenCalled();
  });

  it('Should render empty container on empty todos', () => {
    const { queryAllByRole } = render(<TodoList todos={[]} />);

    expect(queryAllByRole('button').length).toBe(0);
  });

  it('Should render something when there is one todo', () => {
    const todos = [
      {
        id: 1,
        title: 'A todo',
        done: false,
      },
    ];

    const { queryAllByRole } = render(<TodoList todos={todos} />);

    expect(queryAllByRole('button').length).not.toBe(0);
  });

  it('Should focus an item when clicked', () => {
    const todos = [
      {
        id: 1,
        title: 'A todo',
        done: false,
      },
    ];

    const { getByTestId, queryByRole } = render(<TodoList todos={todos} />);

    fireEvent.click(getByTestId('todo-1'));
    expect(queryByRole('textbox')).not.toBe(null);
  });

  it('Should have only the last item focused after clicking another item', () => {
    const todos = [
      {
        id: 1,
        title: 'A todo',
        done: false,
      },
      {
        id: 2,
        title: 'A todo 2',
        done: false,
      },
      {
        id: 3,
        title: 'A todo 3',
        done: false,
      },
    ];

    const { getByTestId, queryByTestId, queryAllByRole } = render(
      <TodoList todos={todos} />,
    );

    fireEvent.click(getByTestId('todo-1'));
    fireEvent.click(getByTestId('todo-3'));

    expect(queryAllByRole('textbox').length).toBe(1);
    expect(queryByTestId('todo-3')).toBe(null);
  });

  it('Should call the delete hook with the appropiate ID when a delete button is clicked', () => {
    const deleteTodoHookMock = jest.fn();

    const todos = [
      {
        id: 1,
        title: 'A todo',
        done: false,
      },
      {
        id: 2,
        title: 'A todo 2',
        done: false,
      },
      {
        id: 3,
        title: 'A todo 3',
        done: false,
      },
    ];

    const { getByTestId } = render(
      <TodoList todos={todos} deleteTodo={deleteTodoHookMock} />,
    );

    fireEvent.click(getByTestId('delete-2'));

    expect(deleteTodoHookMock).toHaveBeenCalledWith(2);
  });

  it('Should call the toggle hook with the appropiate ID when a toggle button is clicked', () => {
    const toggleTodoHookMock = jest.fn();

    const todos = [
      {
        id: 1,
        title: 'A todo',
        done: false,
      },
      {
        id: 2,
        title: 'A todo 2',
        done: false,
      },
      {
        id: 3,
        title: 'A todo 3',
        done: false,
      },
    ];

    const { getByTestId } = render(
      <TodoList todos={todos} toggleTodo={toggleTodoHookMock} />,
    );

    fireEvent.click(getByTestId('toggle-2'));

    expect(toggleTodoHookMock).toHaveBeenCalledWith(2);
  });

  it('Should call the edit hook with the appropiate ID and new value when a todo is clicked, edited and then pressed enter', () => {
    const editTodoHookMock = jest.fn();
    const newValue = 'New value for todo';

    const todos = [
      {
        id: 1,
        title: 'A todo',
        done: false,
      },
      {
        id: 2,
        title: 'A todo 2',
        done: false,
      },
      {
        id: 3,
        title: 'A todo 3',
        done: false,
      },
    ];

    const { getByTestId } = render(
      <TodoList todos={todos} editTodo={editTodoHookMock} />,
    );

    fireEvent.click(getByTestId('todo-2'));
    fireEvent.change(getByTestId('editInput-2'), {
      target: { value: newValue },
    });
    fireEvent.keyDown(getByTestId('editInput-2'), {
      key: 'Enter',
      keyCode: 13,
    });

    expect(editTodoHookMock).toHaveBeenCalledWith(2, newValue);
  });

  it('Should not call the edit hook when a todo is clicked and pressed enter without editing', () => {
    const editTodoHookMock = jest.fn();

    const todos = [
      {
        id: 1,
        title: 'A todo',
        done: false,
      },
      {
        id: 2,
        title: 'A todo 2',
        done: false,
      },
      {
        id: 3,
        title: 'A todo 3',
        done: false,
      },
    ];

    const { getByTestId } = render(
      <TodoList todos={todos} editTodo={editTodoHookMock} />,
    );

    fireEvent.click(getByTestId('todo-2'));
    fireEvent.keyDown(getByTestId('editInput-2'), {
      key: 'Enter',
      keyCode: 13,
    });

    expect(editTodoHookMock).not.toHaveBeenCalled();
  });

  it('Should call the edit hook with the appropiate ID and new value when a todo is focused, edited and then another todo gets focused', () => {
    const editTodoHookMock = jest.fn();
    const newValue = 'New value for todo';

    const todos = [
      {
        id: 1,
        title: 'A todo',
        done: false,
      },
      {
        id: 2,
        title: 'A todo 2',
        done: false,
      },
      {
        id: 3,
        title: 'A todo 3',
        done: false,
      },
    ];

    const { getByTestId } = render(
      <TodoList todos={todos} editTodo={editTodoHookMock} />,
    );

    fireEvent.click(getByTestId('todo-2'));
    fireEvent.change(getByTestId('editInput-2'), {
      target: { value: newValue },
    });
    fireEvent.click(getByTestId('todo-1'));

    expect(editTodoHookMock).toHaveBeenCalledWith(2, newValue);
  });

  it('Should unfocus a todo after hitting enter in edit mode', () => {
    const todos = [
      {
        id: 1,
        title: 'A todo',
        done: false,
      },
      {
        id: 2,
        title: 'A todo 2',
        done: false,
      },
      {
        id: 3,
        title: 'A todo 3',
        done: false,
      },
    ];

    const { getByTestId, queryByTestId } = render(<TodoList todos={todos} />);

    fireEvent.click(getByTestId('todo-2'));
    fireEvent.keyDown(getByTestId('editInput-2'), {
      key: 'Enter',
      keyCode: 13,
    });

    expect(queryByTestId('editInput-2')).toBe(null);
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

    fireEvent.click(getByTestId('todo-3'));
    // @TODO Will this work? Check snapshot when fully implemented!
    expect(firstChild).toMatchSnapshot();
  });
});
