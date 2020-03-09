/**
 *
 * TodoListPage
 *
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { useQuery } from 'react-apollo';

import TodoList from 'components/TodoList';
import H1 from 'components/H1';
import LoadingIndicator from 'components/LoadingIndicator';
import messages from './messages';
import { GET_TODOS_QUERY } from './queries';

export function TodoListPage() {
  const { loading, data, error } = useQuery(GET_TODOS_QUERY);

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
        <TodoList todos={data.getTodoList} />
      )}
    </div>
  );
}

export default TodoListPage;
