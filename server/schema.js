const typeDefs = `
  type Query {
    todos(id: ID!): [Todo]
    comments(id: ID!): [Comment]
    todoLists: [TodoList]
    todoList(id: ID!): TodoList
  }

  type Mutation {
    addTodoList(todoList: TodoListInput): TodoList
    updateTodoList(todoList: TodoListInput): TodoList
    addTodo(todo: TodoInput): Todo
    updateTodo(todo: TodoInput): Todo
    addComment(comment: CommentInput): Comment
  }

  input TodoListInput {
    name: String
    user: String
    id: ID
    deleted: Boolean
  }

  type Comment {
    text: String
    user: String
    id: ID!
    todoId: String
  }

  input CommentInput {
    text: String
    user: String
    id: ID!
    todoId: String
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
    commentsCount: Int
  }

  schema {
    query: Query
    mutation: Mutation
  }
`
export default typeDefs
