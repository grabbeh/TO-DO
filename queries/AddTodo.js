import gql from 'graphql-tag'

export default gql`
  mutation addTodo($todo: TodoInput) {
    addTodo(todo: $todo) {
      text
      contact
      priority
      id
      todoListId
      user
      completed
      deleted
      createdSince
      commentsCount
    }
  }
`
