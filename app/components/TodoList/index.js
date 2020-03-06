/**
 *
 * TodoList
 *
 */

import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';

import TodoItem from 'components/TodoItem';

function TodoList({ todos, deleteTodo, toggleTodo }) {
  const [focusedItem, setFocusedItem] = useState(null);

  return (
    <div>
      {todos.map(({ id, title, done }) => (
        <TodoItem
          key={`todo-item-${id}`}
          id={id}
          title={title}
          done={done}
          focused={focusedItem === id}
          focusTodo={() => setFocusedItem(id)}
          deleteTodo={() => deleteTodo(id)}
          toggleTodo={() => toggleTodo(id)}
        />
      ))}
    </div>
  );
}

TodoList.propTypes = {
  todos: PropTypes.array.isRequired,
  deleteTodo: PropTypes.func,
  toggleTodo: PropTypes.func,
};

export default memo(TodoList);
