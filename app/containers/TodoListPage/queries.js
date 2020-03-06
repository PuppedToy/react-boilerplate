import gql from 'graphql-tag';

export const GET_TODOS_QUERY = gql`
  {
    getTodoList {
      id
      title
      done
    }
  }
`;

export const ADD_TODO_QUERY = gql`
  mutation addTodo($title: String!) {
    addTodo(title: $title) {
      id
      title
      done
    }
  }
`;

export const DELETE_TODO_QUERY = gql`
  mutation deleteTodo($id: Int!) {
    deleteTodo(id: $id) {
      id
      title
      done
    }
  }
`;

export const TOGGLE_TODO_QUERY = gql`
  mutation toggleTodo($id: Int!) {
    toggleTodo(id: $id) {
      id
      title
      done
    }
  }
`;

export const EDIT_TODO_QUERY = gql`
  mutation toggleTodo($id: Int!, $title: String!) {
    toggleTodo(id: $id, title: $title) {
      id
      title
      done
    }
  }
`;
