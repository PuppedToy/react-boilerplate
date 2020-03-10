import { gql } from 'apollo-boost';

export const GET_TODOS_QUERY = gql`
  {
    getTodoList {
      id
      title
      done
    }
  }
`;

export const ADD_TODO_MUTATION = gql`
  mutation addTodo($title: String!) {
    addTodo(title: $title) {
      id
      title
      done
    }
  }
`;

export const DELETE_TODO_MUTATION = gql`
  mutation deleteTodo($id: Int!) {
    deleteTodo(id: $id) {
      id
      title
      done
    }
  }
`;

export const TOGGLE_TODO_MUTATION = gql`
  mutation toggleTodo($id: Int!) {
    toggleTodo(id: $id) {
      id
      title
      done
    }
  }
`;

export const EDIT_TODO_MUTATION = gql`
  mutation editTodo($id: Int!, $title: String!) {
    editTodo(id: $id, title: $title) {
      id
      title
      done
    }
  }
`;
