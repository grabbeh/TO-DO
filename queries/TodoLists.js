import gql from 'graphql-tag'

export default gql`
  query {
    todoLists {
      id
      name
      user
      deleted
      activeTodosVolume
      completedTodosVolume
    }
  }
`
