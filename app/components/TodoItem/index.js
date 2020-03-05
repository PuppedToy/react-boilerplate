/**
 *
 * TodoItem
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

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
          type="button"
        >
          {title}
        </button>
      )}
      <button
        data-testid={`toggle-${id}`}
        src={`/${done}`}
        onClick={() => {
          if (toggleTodo) toggleTodo();
        }}
        onKeyDown={emptyHandler}
        type="button"
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
