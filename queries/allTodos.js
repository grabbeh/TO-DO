import gql from 'graphql-tag'

export default gql`
  query allTodos(
    $olderThan: Int
    $earlierThan: Int
    $priority: String
    $status: String
    $pinned: Boolean
    $todoListId: String
    $cursor: String
  ) {
    allTodos(
      olderThan: $olderThan
      earlierThan: $earlierThan
      priority: $priority
      status: $status
      pinned: $pinned
      todoListId: $todoListId
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
  }
`
