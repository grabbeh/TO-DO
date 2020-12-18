const typeDefs = `
  type Query {
    todos: [ToDo]
  }

  type Mutation {
    addToDo(todo: ToDoInput): ToDo
    updateToDo(todo: ToDoInput): ToDo
  }

  input ToDoInput {
    text: String
    user: String
    id: ID
    completed: Boolean
    deleted: Boolean
    position: Int
    createdSince: String
  }

  scalar Date
  
  type ToDo {
    id: ID!
    user: String!
    text: String!
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
