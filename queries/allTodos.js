import gql from 'graphql-tag'

export default gql`
  query allTodos(
    $oldest: Boolean
    $newest: Boolean
    $olderThan: Int
    $earlierThan: Int
    $priority: String
    $status: String
    $pinned: Boolean
    $id: String
    $cursor: String
  ) {
    allTodos(
      oldest: $oldest
      newest: $newest
      olderThan: $olderThan
      earlierThan: $earlierThan
      priority: $priority
      status: $status
      pinned: $pinned
      id: $id
      cursor: $cursor
    ) {
      id
      todoListId
      text
      contact
      priority
      user
      status
      createdSince
      commentsCount
      todoListName
      pinned
    }
    todoList(id: $id) {
      name
    }
  }
`
