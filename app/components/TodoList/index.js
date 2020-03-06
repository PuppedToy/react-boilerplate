/**
 *
 * TodoList
 *
 */

import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';

import TodoItem from 'components/TodoItem';

function TodoList({ todos, deleteTodo, toggleTodo, editTodo }) {
  const [focusedItem, setFocusedItem] = useState(null);
  const [focusedItemTitle, setFocusedItemTitle] = useState(null);

  return (
    <div>
      {todos.map(({ id, title, done }) => (
        <TodoItem
          key={`todo-item-${id}`}
          id={id}
          title={focusedItem === id ? focusedItemTitle : title}
          done={done}
          focused={focusedItem === id}
          focusTodo={() => {
            if (focusedItem !== null && editTodo) {
              editTodo(focusedItem, focusedItemTitle);
            }
            setFocusedItem(id);
            setFocusedItemTitle(title);
          }}
          deleteTodo={() => {
            if (deleteTodo) deleteTodo(id);
          }}
          toggleTodo={() => {
            if (toggleTodo) toggleTodo(id);
          }}
          editTodo={() => {
            setFocusedItem(null);
            if (title !== focusedItemTitle && editTodo) {
              editTodo(id, focusedItemTitle);
            }
            setFocusedItemTitle(null);
          }}
          onChangeTodoInput={newValue => setFocusedItemTitle(newValue)}
        />
      ))}
    </div>
  );
}

TodoList.propTypes = {
  todos: PropTypes.array.isRequired,
  deleteTodo: PropTypes.func,
  toggleTodo: PropTypes.func,
  editTodo: PropTypes.func,
};

export default memo(TodoList);
