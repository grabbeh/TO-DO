import gql from 'graphql-tag'

export default gql`
  mutation addTodo($todo: TodoInput) {
    addTodo(todo: $todo) {
      text
      contact
      priority
      id
      todoListId
      todoListName
      user
      status
      pinned
      createdSince
      commentsCount
    }
  }
`
