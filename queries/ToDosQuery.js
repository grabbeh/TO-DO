import gql from 'graphql-tag'

export default gql`
  query todos($id: ID!) {
    todos(id: $id) {
      id
      todoListId
      text
      user
      completed
      deleted
      position
      createdSince
    }
  }
`
