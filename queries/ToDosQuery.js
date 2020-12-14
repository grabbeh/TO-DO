import gql from 'graphql-tag'

export default gql`
  query {
    todos {
      id
      text
      user
      completed
      deleted
      position
    }
  }
`
