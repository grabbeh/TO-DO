import { GraphQLScalarType } from 'graphql'
import { Kind } from 'graphql/language'
import { Todo, TodoList, TodoTable, Comment } from './table.js'
import { formatDistanceToNow, format } from 'date-fns'
import KSUID from 'ksuid'
import crypto from 'crypto'

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
    todosByDate: async (p, a, c) => {
      const timeInMs =
        Date.now() - 86400 * 1000 * (a.olderThan || a.earlierThan)
      console.log(timeInMs)
      const payload = crypto.randomBytes(16)
      const relevantKSUID = KSUID.fromParts(timeInMs, payload)
      let baseOptions = {
        index: 'GSI3',
        reverse: true
      }
      let options
      if (a.olderThan) {
        options = {
          ...baseOptions,
          lt: relevantKSUID.string
        }
      } else {
        options = {
          ...baseOptions,
          gt: relevantKSUID.string
        }
      }

      let todos = await Todo.query(`USER#mbg@outlook.com#TODO`, options)
      return todos.Items
    },
    todoList: async (p, a, c) => {
      // get queries are auto prefixed with stated prefix
      let todoList = await TodoList.get({
        pk: `mbg@outlook.com`,
        sk: `${a.id}`
      })
      return todoList.Item
    },
    todoLists: async () => {
      let todoLists = await TodoList.query('USER#mbg@outlook.com', {
        beginsWith: 'TODOLIST#'
      })
      return todoLists.Items
    },
    todo: async (p, a, c) => {
      let { id } = a
      let todo = await Todo.get({ id, sk: id })
      return todo.Item
    }
  },
  Mutation: {
    addTodoList: async (p, a, c) => {
      let {
        todoList: { name, id, user }
      } = a

      let todoList = {
        name,
        user,
        id,
        deleted: false,
        GSI1pk: `USER#mbg@outlook.com#TODOLIST#${id}`,
        GSI1sk: `TODOLIST#${id}`
      }
      await TodoList.put({ ...todoList })
      return todoList
    },
    updateTodoList: async (p, a, c) => {
      console.log(a)
      let { todoList } = a
      await TodoList.update({
        ...todoList,
        GSI1pk: `USER#mbg@outlook.com#TODOLIST#${a.id}`,
        GSI1sk: `TODOLIST#${a.id}`
      })
      return todoList
    },
    addTodo: async (p, a, c) => {
      let { todo } = a
      let { id, todoListId, deleted } = todo
      let status = deleted ? 'DELETED' : 'ACTIVE'
      const ksuid = await KSUID.random()
      await Todo.put({
        ...todo,
        id,
        sk: id,
        GSI1pk: `USER#mbg@outlook.com#TODOLIST#${todoListId}`,
        GSI1sk: `TODO#STATUS#${status}`,
        GSI3pk: `USER#mbg@outlook.com#TODO`,
        GSI3sk: ksuid
      })
      // We don't store 'createdSince' in the DB because it's calculated on each request
      // as relative to the time of creation
      return { ...todo, createdSince: 0, commentsCount: 0 }
    },
    updateTodo: async (p, a, c) => {
      let { todo } = a
      let { id, todoListId, deleted } = todo
      let dbResult = await Todo.get({ id, sk: id })
      let status = deleted ? 'DELETED' : 'ACTIVE'
      delete todo['createdSince']
      delete todo['commentsCount']
      delete todo['comments']
      await Todo.update({
        ...todo,
        pk: id,
        sk: id,
        GSI1pk: `USER#mbg@outlook.com#TODOLIST#${todoListId}`,
        GSI1sk: `TODO#STATUS#${status}`,
        GSI3pk: dbResult.Item.GSI3pk,
        GSI3sk: dbResult.Item.GSI3sk
      })
      return todo
    },
    addComment: async (p, a, c) => {
      let { comment } = a
      let { id, todoId } = comment
      await Comment.put({
        ...comment,
        id,
        sk: id,
        GSI2pk: `TODO#${todoId}`,
        GSI2sk: `COMMENT#${id}`
      })
      // We don't store 'createdSince' in the DB because it's calculated on each request
      // as relative to the time of creation
      return { ...comment, createdAt: new Date().toISOString() }
    }
  },
  TodoList: {
    todos: async (todoList, a) => {
      let pk = `USER#mbg@outlook.com#TODOLIST#${todoList.id}`
      let todos = await TodoTable.query(pk, {
        beginsWith: `TODO#STATUS#${a.status}`,
        index: 'GSI1'
      })
      return todos.Items
    },
    totalTodos: async todoList => {
      let pk = `USER#mbg@outlook.com#TODOLIST#${todoList.id}`
      let todos = await TodoTable.query(pk, {
        beginsWith: 'TODO#STATUS#ACTIVE',
        index: 'GSI1'
      })
      return todos.Items.length
    },
    completedTodos: async todoList => {
      let pk = `USER#mbg@outlook.com#TODOLIST#${todoList.id}`
      let todos = await TodoTable.query(pk, {
        beginsWith: 'TODO#STATUS#ACTIVE',
        index: 'GSI1'
      })
      let completed = todos.Items.filter(t => {
        return t.completed
      })
      return completed.length
    }
  },
  Comment: {
    createdAt: async comment => {
      if (comment.created) {
        return format(new Date(comment.created), 'd MMM yyyy k:m')
      } else return 'Just now'
    }
  },
  Todo: {
    createdSince: async todo => {
      let distance = formatDistanceToNow(new Date(todo.created))
      return distance
    },
    commentsCount: async todo => {
      let pk = `TODO#${todo.id}`
      let comments = await TodoTable.query(pk, {
        beginsWith: 'COMMENT#',
        index: 'GSI2'
      })
      return comments.Items.length
    },
    comments: async todo => {
      let pk = `TODO#${todo.id}`
      let comments = await TodoTable.query(pk, {
        beginsWith: 'COMMENT#',
        index: 'GSI2'
      })
      return comments.Items
    }
  }
}

export default resolvers
