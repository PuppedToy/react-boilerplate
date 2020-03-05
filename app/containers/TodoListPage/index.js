/**
 *
 * TodoListPage
 *
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';

import H1 from 'components/H1';
import messages from './messages';

export function TodoListPage() {
  return (
    <div>
      <Helmet>
        <title>To do List</title>
        <meta name="description" content="Description of TodoListPage" />
      </Helmet>
      <H1>
        <FormattedMessage {...messages.header} />
      </H1>
    </div>
  );
}

export default TodoListPage;
