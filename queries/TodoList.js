import gql from 'graphql-tag'

export default gql`
  query todoList($id: ID!) {
    todoList(id: $id) {
      id
      name
      user
      deleted
    }
  }
`
