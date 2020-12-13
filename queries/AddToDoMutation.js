import gql from 'graphql-tag'

export default gql`
  mutation addToDo($todo: ToDoInput) {
    addToDo(todo: $todo) {
      text
      id
      user
      completed
      deleted
    }
  }
`
