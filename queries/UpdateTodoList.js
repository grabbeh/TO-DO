import gql from 'graphql-tag'

export default gql`
  mutation updateTodoList($todoList: TodoListInput) {
    updateTodoList(todoList: $todoList) {
      name
      id
      user
      deleted
      activeTodosVolume
      completedTodosVolume
    }
  }
`
