const typeDefs = `
  type Query {
    todo(id: ID!): Todo
    comments(id: ID!): [Comment]
    todoLists: [TodoList]
    todoList(id: String): TodoList
    allTodos(oldest: Boolean, newest: Boolean, id: String, olderThan: Int, pinned: Boolean, earlierThan: Int, status: String, priority: String, cursor: String): [Todo]
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
    org: String
    id: String
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
    todoId: String
  }

  type TodoList {
    name: String
    user: String
    org: String
    id: String
    deleted: Boolean
    activeTodosVolume: Int
    completedTodosVolume: Int
  }

  input TodoInput {
    text: String
    user: String
    id: String
    status: String
    todoListId: String
    comments: [CommentInput]
    pinned: Boolean!
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
    pinned: Boolean!
    status: String!
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
