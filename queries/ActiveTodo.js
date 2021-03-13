import gql from 'graphql-tag'

const ActiveTodo = gql`
  query ActiveTodo {
    activeTodo @client
  }
`

export default ActiveTodo
