/**
 *
 * TodoItem
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

import Checkbox from './Checkbox';
import DeleteButton from './DeleteButton';
import Wrapper from './Wrapper';
import TodoOptions from './TodoOptions';
import TodoTitle from './TodoTitle';
import Input from './Input';

function TodoItem({
  id,
  title,
  done,
  focused,
  deleteTodo,
  focusTodo,
  editTodo,
  toggleTodo,
  onChangeTodoInput,
}) {
  const inputKeyDownHandler = ({ code, which }) => {
    if (editTodo && ((code && code === 13) || (which && which === 13)))
      editTodo();
  };
  const inputOnChangeHandler = ({ target }) => {
    if (
      onChangeTodoInput &&
      target &&
      Object.hasOwnProperty.call(target, 'value')
    )
      onChangeTodoInput(target.value);
  };
  const emptyHandler = () => {};

  return (
    <Wrapper id={`todo-${id}`}>
      {focused ? (
        <Input
          type="text"
          value={title}
          onChange={inputOnChangeHandler}
          onKeyDown={inputKeyDownHandler}
          data-testid={`editInput-${id}`}
        />
      ) : (
        <TodoTitle
          onClick={() => {
            if (focusTodo) focusTodo();
          }}
          onKeyDown={emptyHandler}
          data-testid={`todo-${id}`}
          type="button"
          role="button"
        >
          {title}
        </TodoTitle>
      )}
      <TodoOptions>
        <Checkbox
          data-testid={`toggle-${id}`}
          done={done}
          onClick={() => {
            if (toggleTodo) toggleTodo();
          }}
          onKeyDown={emptyHandler}
          type="button"
          role="button"
          alt={done ? 'uncheck' : 'check'}
        />
        <DeleteButton
          data-testid={`delete-${id}`}
          onClick={() => {
            if (deleteTodo) deleteTodo();
          }}
          onKeyDown={emptyHandler}
          type="button"
          role="button"
          alt="delete"
        />
      </TodoOptions>
    </Wrapper>
  );
}

TodoItem.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  done: PropTypes.bool.isRequired,
  focused: PropTypes.bool.isRequired,
  deleteTodo: PropTypes.func,
  focusTodo: PropTypes.func,
  editTodo: PropTypes.func,
  toggleTodo: PropTypes.func,
  onChangeTodoInput: PropTypes.func,
};

export default TodoItem;
