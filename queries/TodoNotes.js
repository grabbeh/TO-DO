import gql from 'graphql-tag'

export default gql`
  query todo($id: ID!) {
    todo(id: $id) {
      commentsCount
      text
      id
      comments {
        text
        id
        createdAt
      }
    }
  }
`
