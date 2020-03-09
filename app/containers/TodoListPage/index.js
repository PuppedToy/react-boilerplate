/**
 *
 * TodoListPage
 *
 */

import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { useQuery, useMutation } from 'react-apollo';

import TodoList from 'components/TodoList';
import H1 from 'components/H1';
import LoadingIndicator from 'components/LoadingIndicator';
import messages from './messages';
import {
  GET_TODOS_QUERY,
  DELETE_TODO_MUTATION,
  TOGGLE_TODO_MUTATION,
  EDIT_TODO_MUTATION,
  ADD_TODO_MUTATION,
} from './queries';

function useMutationWithRefetch(query, refetch, otherOptions = {}) {
  return useMutation(query, {
    ...otherOptions,
    onCompleted: () => {
      refetch();
    },
  });
}

export function TodoListPage() {
  const [newTodoTitle, setNewTodoTitle] = useState('');

  const { loading, data, error, refetch } = useQuery(GET_TODOS_QUERY);
  const [deleteTodo] = useMutationWithRefetch(DELETE_TODO_MUTATION, refetch);
  const [toggleTodo] = useMutationWithRefetch(TOGGLE_TODO_MUTATION, refetch);
  const [editTodo] = useMutationWithRefetch(EDIT_TODO_MUTATION, refetch);
  const [addTodo] = useMutationWithRefetch(ADD_TODO_MUTATION, refetch);
  const addTodoHandler = () => {
    if (newTodoTitle !== '') {
      addTodo({ variables: { title: newTodoTitle } });
      setNewTodoTitle('');
    }
  };

  return (
    <div>
      <Helmet>
        <title>To do List</title>
        <meta name="description" content="Description of TodoListPage" />
      </Helmet>
      <H1>
        <FormattedMessage {...messages.header} />
      </H1>
      {error ? <div>{error.message}</div> : null}
      {loading || error ? (
        <LoadingIndicator />
      ) : (
        <div>
          <TodoList
            todos={data.getTodoList}
            deleteTodo={id => deleteTodo({ variables: { id } })}
            toggleTodo={id => toggleTodo({ variables: { id } })}
            editTodo={(id, title) => editTodo({ variables: { id, title } })}
          />
          <div>
            <input
              data-testid="add-todo-input"
              type="text"
              value={newTodoTitle}
              onChange={({ target }) => {
                if (target && Object.hasOwnProperty.call(target, 'value'))
                  setNewTodoTitle(target.value);
              }}
              onKeyDown={({ code, which }) => {
                if (code === 13 || which === 13) addTodoHandler();
              }}
            />
            <button
              type="button"
              data-testid="add-todo-button"
              onClick={addTodoHandler}
            >
              <FormattedMessage {...messages.add} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TodoListPage;
