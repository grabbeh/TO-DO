import gql from 'graphql-tag'

export default gql`
  query {
    todoLists {
      id
      name
      org
      user
      deleted
      activeTodosVolume
    }
  }
`
