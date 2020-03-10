/**
 *
 * TodoItem
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

import Checkbox from './Checkbox';

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
    <div id={`todo-${id}`}>
      {focused ? (
        <input
          type="text"
          value={title}
          onChange={inputOnChangeHandler}
          onKeyDown={inputKeyDownHandler}
          data-testid={`editInput-${id}`}
        />
      ) : (
        <button
          onClick={() => {
            if (focusTodo) focusTodo();
          }}
          onKeyDown={emptyHandler}
          data-testid={`todo-${id}`}
          type="button"
        >
          {title}
        </button>
      )}
      <Checkbox
        data-testid={`toggle-${id}`}
        done={done}
        onClick={() => {
          if (toggleTodo) toggleTodo();
        }}
        onKeyDown={emptyHandler}
        type="button"
        role="button"
      />
      <button
        data-testid={`delete-${id}`}
        src={`/${focused}`}
        onClick={() => {
          if (deleteTodo) deleteTodo();
        }}
        onKeyDown={emptyHandler}
        type="button"
      />
    </div>
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
