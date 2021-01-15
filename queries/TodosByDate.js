import gql from 'graphql-tag'

export default gql`
  query {
    todosByDate {
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
