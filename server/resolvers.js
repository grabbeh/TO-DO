import { GraphQLScalarType } from 'graphql'
import { Kind } from 'graphql/language'
import { Todo, TodoList, TodoTable, Comment } from './table.js'
import { formatDistanceToNow, format } from 'date-fns'
import KSUID from 'ksuid'
import crypto from 'crypto'
import { TodolistForm } from '../components/index.js'
import { AddTodoList } from '../queries/index.js'

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
    allTodos: async (p, a, c) => {
      const timeInMs =
        Date.now() - 86400 * 1000 * (a.olderThan || a.earlierThan)
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
      if (a.priority) {
        options = {
          ...options,
          filters: { attr: 'priority', eq: a.priority }
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
      let { todoList } = a
      await TodoList.put({
        ...todoList,
        deleted: false
      })
      return { ...todoList, activeTodosVolume: 0, completedTodosVolume: 0 }
    },
    updateTodoList: async (p, a, c) => {
      let { todoList } = a
      await TodoList.update(todoList)
      return todoList
    },
    addTodo: async (p, a, c) => {
      let { todo } = a
      let { id, todoListId } = todo
      const ksuid = await KSUID.random()
      await Todo.put({
        ...todo,
        id,
        sk: id,
        GSI1pk: `USER#mbg@outlook.com#TODOLIST#${todoListId}`,
        GSI1sk: ksuid.string,
        GSI3pk: `USER#mbg@outlook.com#TODO`,
        GSI3sk: ksuid.string
      })
      return { ...todo, createdSince: 'Just now', commentsCount: 0 }
    },
    updateTodo: async (p, a, c) => {
      let { todo } = a
      let { id, todoListId } = todo
      let dbResult = await Todo.get({ id, sk: id })
      delete todo['createdSince']
      delete todo['commentsCount']
      delete todo['comments']
      await Todo.update({
        ...todo,
        pk: id,
        sk: id,
        GSI1pk: `USER#mbg@outlook.com#TODOLIST#${todoListId}`,
        GSI1sk: dbResult.Item.GSI3sk,
        GSI3pk: dbResult.Item.GSI3pk,
        GSI3sk: dbResult.Item.GSI3sk
      })
      return todo
    },
    addComment: async (p, a, c) => {
      let { comment } = a
      let { id, todoId } = comment
      delete comment['createdAt']
      const ksuid = await KSUID.random()
      await Comment.put({
        ...comment,
        id,
        sk: id,
        GSI2pk: `TODO#${todoId}#COMMENT`,
        GSI2sk: ksuid.string
      })
      return { ...comment, createdAt: 'Just now' }
    }
  },
  TodoList: {
    activeTodos: async (todoList, a) => {
      let pk = `USER#mbg@outlook.com#TODOLIST#${todoList.id}`
      let todos = await TodoTable.query(pk, {
        index: 'GSI1',
        reverse: true,
        filters: [
          { attr: 'completed', eq: false },
          { attr: 'deleted', eq: false }
        ]
      })
      return todos.Items
    },
    completedTodos: async todoList => {
      let pk = `USER#mbg@outlook.com#TODOLIST#${todoList.id}`
      let todos = await TodoTable.query(pk, {
        index: 'GSI1',
        reverse: true,
        filters: [
          { attr: 'deleted', eq: false },
          { attr: 'completed', eq: true }
        ]
      })
      return todos.Items
    },
    deletedTodos: async todoList => {
      let pk = `USER#mbg@outlook.com#TODOLIST#${todoList.id}`
      let todos = await TodoTable.query(pk, {
        index: 'GSI1',
        reverse: true,
        filters: { attr: 'deleted', eq: true }
      })
      return todos.Items
    },
    activeTodosVolume: async todoList => {
      let pk = `USER#mbg@outlook.com#TODOLIST#${todoList.id}`
      let todos = await TodoTable.query(pk, {
        index: 'GSI1',
        reverse: true,
        filters: [
          { attr: 'completed', eq: false },
          { attr: 'deleted', eq: false }
        ]
      })
      return todos.Items.length
    },
    completedTodosVolume: async todoList => {
      let pk = `USER#mbg@outlook.com#TODOLIST#${todoList.id}`
      let todos = await TodoTable.query(pk, {
        index: 'GSI1',
        reverse: true,
        filters: [
          { attr: 'completed', eq: true },
          { attr: 'deleted', eq: false }
        ]
      })
      return todos.Items.length
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
      if (todo.created) {
        return formatDistanceToNow(new Date(todo.created))
      } else return 'Just now'
    },
    commentsCount: async todo => {
      let pk = `TODO#${todo.id}#COMMENT`
      let comments = await TodoTable.query(pk, {
        index: 'GSI2'
      })
      return comments.Items.length
    },
    comments: async todo => {
      let pk = `TODO#${todo.id}#COMMENT`
      let comments = await TodoTable.query(pk, {
        index: 'GSI2',
        reverse: true
      })
      return comments.Items
    }
  }
}

export default resolvers
