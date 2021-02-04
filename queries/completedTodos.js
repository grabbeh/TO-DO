import gql from 'graphql-tag'

export default gql`
  query todos($id: ID!) {
    todoList(id: $id) {
      name
      id
      completedTodos {
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
