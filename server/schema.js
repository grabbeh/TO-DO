const typeDefs = `
  type Query {
    todos(id: ID!): [Todo]
    todo(id: ID!): Todo
    comments(id: ID!): [Comment]
    todoLists: [TodoList]
    todoList(id: ID!): TodoList
    todosByDate(olderThan: Int, earlierThan: Int): [Todo]
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
    createdAt: String
  }

  input CommentInput {
    text: String
    user: String
    id: ID!
    todoId: String
    createdAt: String
  }

  type TodoList {
    name: String
    user: String
    id: ID
    todos(status: String): [Todo]
    deleted: Boolean
    totalTodos: Int
    completedTodos: Int
  }

  input TodoInput {
    text: String
    user: String
    id: ID
    completed: Boolean
    todoListId: String
    comments: [CommentInput]
    deleted: Boolean
    createdSince: String
    commentsCount: Int
    priority: String
    contact: String
  }

  scalar Date
  
  type Todo {
    id: ID!
    user: String!
    text: String!
    todoListId: String!
    completed: Boolean!
    deleted: Boolean!
    comments: [Comment]
    createdSince: String
    commentsCount: Int
    priority: String
    contact: String
  }

  schema {
    query: Query
    mutation: Mutation
  }
`
export default typeDefs
