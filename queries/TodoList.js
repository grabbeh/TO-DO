import gql from 'graphql-tag'

export default gql`
  query todoList($id: String) {
    todoList(id: $id) {
      id
      name
      user
      deleted
    }
  }
`
