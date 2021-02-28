import gql from 'graphql-tag'

export default gql`
  mutation updateTodo($todo: TodoInput) {
    updateTodo(todo: $todo) {
      text
      priority
      contact
      id
      user
      todoListId
      status
      pinned
    }
  }
`
