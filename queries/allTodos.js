import gql from 'graphql-tag'

export default gql`
  query allTodos(
    $olderThan: Int
    $earlierThan: Int
    $priority: String
    $status: String
    $pinned: Boolean
  ) {
    allTodos(
      olderThan: $olderThan
      earlierThan: $earlierThan
      priority: $priority
      status: $status
      pinned: $pinned
    ) {
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
  }
`
