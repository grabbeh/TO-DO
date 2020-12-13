const typeDefs = `
  type Query {
    todos: [ToDo]
  }

  type Mutation {
    addToDo(todo: ToDoInput): ToDo
    completeToDo(todo: ToDoInput): ToDo
  }

  input ToDoInput {
    text: String
    user: String
    id: ID
    completed: Boolean
    deleted: Boolean
  }

  scalar Date
  
  type MyType {
    created: Date
  }

  type ToDo {
    id: ID!
    user: String!
    text: String!
    completed: Boolean!
    deleted: Boolean!
  }

  schema {
    query: Query
    mutation: Mutation
  }
`
export default typeDefs
