/*
 * TodoListPage Messages
 *
 * This contains all the text for the TodoListPage container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.TodoListPage';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'To do List',
  },
  add: {
    id: `${scope}.add`,
    defaultMessage: 'Add',
  },
});
