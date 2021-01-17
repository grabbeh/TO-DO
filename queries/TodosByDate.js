import gql from 'graphql-tag'

export default gql`
  query todosByDate($olderThan: Int, $earlierThan: Int) {
    todosByDate(olderThan: $olderThan, earlierThan: $earlierThan) {
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
`
