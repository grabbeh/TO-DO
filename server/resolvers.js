import { GraphQLScalarType } from 'graphql'
import { Kind } from 'graphql/language'
import { ToDo } from './table.js'
import { v4 as uuidv4 } from 'uuid'

const resolvers = {
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue (value) {
      return new Date(value) // value from the client
    },
    serialize (value) {
      return value.getTime() // value sent to the client
    },
    parseLiteral (ast) {
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value, 10) // ast value is always in string format
      }
      return null
    }
  }),
  Query: {
    todos: async (__, ___, context) => {
      let todos = await ToDo.query('USER#mbg@outlook.com', {
        beginsWith: 'TODO#'
      })
      return todos.Items
    }
  },
  Mutation: {
    addToDo: async (p, a, c) => {
      let todo
      if (a.todo.id) {
        todo = a.todo
      } else {
        const uuid = uuidv4()
        todo = {
          text: a.todo.text,
          user: 'mbg@outlook.com',
          id: uuid,
          completed: false,
          deleted: false
        }
      }

      let result = await ToDo.put({ ...todo })
      return todo
    }
  }
}

export default resolvers
