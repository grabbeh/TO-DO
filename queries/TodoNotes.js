import gql from 'graphql-tag'

export default gql`
  query todo($id: ID!) {
    todo(id: $id) {
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
      comments {
        text
        id
        createdAt
      }
    }
  }
`
