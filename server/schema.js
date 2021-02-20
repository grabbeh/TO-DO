const typeDefs = `
  type Query {
    todo(id: ID!): Todo
    comments(id: ID!): [Comment]
    todoLists: [TodoList]
    todoList(id: ID!): TodoList
    allTodos(olderThan: Int, earlierThan: Int, status: String, priority: String): [Todo]
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
    activeTodosVolume: Int
    completedTodosVolume: Int
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
    activeTodos: [Todo]
    completedTodos: [Todo]
    deletedTodos: [Todo]
    deleted: Boolean
    activeTodosVolume: Int
    completedTodosVolume: Int
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
    todoListName: String
  }

  scalar Date
  
  type Todo {
    id: ID!
    user: String!
    text: String!
    todoListId: String!
    todoListName: String!
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
