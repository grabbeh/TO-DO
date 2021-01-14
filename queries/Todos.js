import gql from 'graphql-tag'

export default gql`
  query todos($id: ID!, $status: String) {
    todoList(id: $id) {
      name
      todos(status: $status) {
        id
        todoListId
        text
        contact
        priority
        user
        completed
        deleted
        createdSince
        commentsCount
      }
    }
  }
`
