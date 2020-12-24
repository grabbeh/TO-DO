const typeDefs = `
  type Query {
    todos(id: ID!): [Todo]
    todoLists: [TodoList]
  }

  type Mutation {
    addTodoList(todoList: TodoListInput): TodoList
    updateTodoList(todoList: TodoListInput): TodoList
    addTodo(todo: TodoInput): Todo
    updateTodo(todo: TodoInput): Todo
  }

  input TodoListInput {
    name: String
    user: String
    id: ID
    deleted: Boolean
  }

  type TodoList {
    name: String
    user: String
    id: ID
    deleted: Boolean
  }

  input TodoInput {
    text: String
    user: String
    id: ID
    completed: Boolean
    todoListId: String
    deleted: Boolean
    position: Int
    createdSince: String
  }

  scalar Date
  
  type Todo {
    id: ID!
    user: String!
    text: String!
    todoListId: String!
    completed: Boolean!
    deleted: Boolean!
    position: Int!
    createdSince: String
  }

  schema {
    query: Query
    mutation: Mutation
  }
`
export default typeDefs
