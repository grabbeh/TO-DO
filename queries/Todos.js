import gql from 'graphql-tag'

export default gql`
  query todos($id: ID!) {
    todoList(id: $id) {
      name
      id
      activeTodos {
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
