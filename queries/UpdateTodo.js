import gql from 'graphql-tag'

export default gql`
  mutation updateTodo($todo: TodoInput) {
    updateTodo(todo: $todo) {
      text
      id
      user
      todoListId
      completed
      deleted
      position
    }
  }
`
