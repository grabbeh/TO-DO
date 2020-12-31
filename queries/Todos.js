import gql from 'graphql-tag'

export default gql`
  query todos($id: ID!) {
    todoList(id: $id) {
      name
      todos {
        id
        todoListId
        text
        user
        completed
        deleted
        createdSince
        commentsCount
      }
    }
  }
`
