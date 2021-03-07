import gql from 'graphql-tag'

export default gql`
  mutation addTodoList($todoList: TodoListInput) {
    addTodoList(todoList: $todoList) {
      name
      id
      org
      user
      deleted
      activeTodosVolume
    }
  }
`
