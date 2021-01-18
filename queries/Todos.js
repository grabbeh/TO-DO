import gql from 'graphql-tag'

export default gql`
  query todos($id: ID!, $priority: String, $status: String) {
    todoList(id: $id) {
      name
      id
      todos(priority: $priority, status: $status) {
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
