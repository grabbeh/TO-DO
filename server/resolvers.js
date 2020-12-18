import { GraphQLScalarType } from 'graphql'
import { Kind } from 'graphql/language'
import { ToDo } from './table.js'
import { formatDistanceToNowStrict } from 'date-fns'

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
    todos: async (p, a, c) => {
      let todos = await ToDo.query('USER#mbg@outlook.com', {
        beginsWith: 'TODO#'
      })
      console.log(todos.Items)
      return todos.Items
    }
  },
  Mutation: {
    addToDo: async (p, a, c) => {
      let {
        todo: { text, position, id, user }
      } = a

      let todo = {
        text,
        position,
        user,
        id,
        completed: false,
        deleted: false
      }

      await ToDo.put({ ...todo })
      return todo
    },
    updateToDo: async (p, a, c) => {
      let { todo } = a
      await ToDo.put({ ...todo })
      return todo
    }
  },
  ToDo: {
    createdSince: async todo => {
      let days = formatDistanceToNowStrict(new Date(todo.created), {
        unit: 'day'
      })
      let rating = days.slice(0, 1)
      return Number(rating)
    }
  }
}

export default resolvers
