import gql from 'graphql-tag'

export default gql`
  mutation updateToDo($todo: ToDoInput) {
    updateToDo(todo: $todo) {
      text
      id
      user
      completed
      deleted
      position
    }
  }
`
