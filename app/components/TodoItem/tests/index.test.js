/**
 *
 * Tests for TodoItem
 *
 * @see https://github.com/react-boilerplate/react-boilerplate/tree/master/docs/testing
 *
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import TodoItem from '../index';

describe('<TodoItem />', () => {
  it('Expect to not log errors in console', () => {
    const spy = jest.spyOn(global.console, 'error');
    render(<TodoItem title="One item" id={1} done={false} focused={false} />);
    expect(spy).not.toHaveBeenCalled();
  });

  it('Should call delete hook when delete button is clicked', () => {
    const deleteTodoMock = jest.fn();
    const { getByTestId } = render(
      <TodoItem
        title="One item"
        id={1}
        done={false}
        focused={false}
        deleteTodo={deleteTodoMock}
      />,
    );

    fireEvent.click(getByTestId('delete'));
    expect(deleteTodoMock).toHaveBeenCalled();
  });

  it('Should call toggle hook when toggle button is clicked', () => {
    const toggleTodoMock = jest.fn();
    const { getByTestId } = render(
      <TodoItem
        title="One item"
        id={1}
        done={false}
        focused={false}
        toggleTodo={toggleTodoMock}
      />,
    );

    fireEvent.click(getByTestId('toggle'));
    expect(toggleTodoMock).toHaveBeenCalled();
  });

  it('Should call focus hook when clicked on the text', () => {
    const focusTodoMock = jest.fn();
    const title = 'One item';
    const { getByText } = render(
      <TodoItem
        title={title}
        id={1}
        done={false}
        focused={false}
        focusTodo={focusTodoMock}
      />,
    );

    fireEvent.click(getByText(title));
    expect(focusTodoMock).toHaveBeenCalled();
  });

  it('Should render an input when called with focused as true', async () => {
    const title = 'One item';
    const { getByTestId } = render(
      <TodoItem title={title} id={1} done={false} focused />,
    );

    expect(getByTestId('editInput')).toHaveValue(title);
  });

  it('Should call edit hook when pressed enter on edition mode', () => {
    const editTodoMock = jest.fn();
    const title = 'One item';
    const { getByTestId } = render(
      <TodoItem
        title={title}
        id={1}
        done={false}
        focused
        editTodo={editTodoMock}
      />,
    );

    fireEvent.keyDown(getByTestId('editInput'), {
      key: 'Enter',
      keyCode: 13,
    });

    expect(editTodoMock).toHaveBeenCalled();
  });

  it('Should call onChange hook when pressed any key edition mode', () => {
    const onChangeTodoInputMock = jest.fn();
    const title = 'One item';
    const { getByTestId } = render(
      <TodoItem
        title={title}
        id={1}
        done={false}
        focused
        onChangeTodoInput={onChangeTodoInputMock}
      />,
    );

    const input = getByTestId('editInput');
    const newValue = 'Changed value';

    fireEvent.change(input, { target: { value: newValue } });
    expect(onChangeTodoInputMock).toHaveBeenCalledWith(newValue);
  });

  it('Should do nothing when pressed enter and edition mode is disabled', () => {
    const editTodoMock = jest.fn();
    const title = 'One item';
    const {
      container: { firstChild },
    } = render(
      <TodoItem
        title={title}
        id={1}
        done={false}
        focused={false}
        editTodo={editTodoMock}
      />,
    );

    fireEvent.keyDown(firstChild, { key: 'Enter', keyCode: 13 });
    expect(editTodoMock).not.toHaveBeenCalled();
  });

  it('Should do nothing when pressed enter and input is not focused', () => {
    const editTodoMock = jest.fn();
    const title = 'One item';
    const {
      container: { firstChild },
    } = render(
      <TodoItem
        title={title}
        id={1}
        done={false}
        focused
        editTodo={editTodoMock}
      />,
    );

    fireEvent.keyDown(firstChild, { key: 'Enter', code: 13, which: 13 });
    expect(editTodoMock).not.toHaveBeenCalled();
  });

  // @TODO Further edition tests should be performed on TodoList, like checking if it actually selects
  // an item after triggering its focus todo or if it does unfocus an item after editing it

  /**
   * Unskip this test to use it
   *
   * @see {@link https://jestjs.io/docs/en/api#testskipname-fn}
   */
  it.skip('Should render and match the snapshot', () => {
    const {
      container: { firstChild },
    } = render(
      <TodoItem title="One item" id={1} done={false} focused={false} />,
    );
    expect(firstChild).toMatchSnapshot();
  });
});
