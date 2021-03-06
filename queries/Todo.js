import gql from 'graphql-tag'

export default gql`
  query todo($id: ID!) {
    todo(id: $id) {
      text
      priority
      id
      contact
      user
      todoListId
      completed
      deleted
    }
  }
`
