import gql from 'graphql-tag'

export default gql`
  query todoList($id: ID!) {
    todoList(id: $id) {
      name
      id
      activeTodosVolume
      completedTodosVolume
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
        todoListName
        pinned
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
        todoListName
      }
    }
  }
`
