import gql from 'graphql-tag'

export default gql`
  mutation addTodo($todo: TodoInput) {
    addTodo(todo: $todo) {
      text
      id
      todoListId
      user
      completed
      deleted
      position
    }
  }
`
