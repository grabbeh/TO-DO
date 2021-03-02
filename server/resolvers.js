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
    allTodos: async (p, a, c) => {
      if (a.todoListId) {
        let pk = `ORG#${c.user.org}#TODOLIST#${a.todoListId}`
        let options = {
          index: 'GSI1',
          reverse: true,
          beginsWith: 'ACTIVE#',
          limit: 2
        }
        if (a.cursor) {
          options = {
            ...options,
            startKey: {
              pk: `ORG#${c.user.org}`,
              sk: `TODO#${c.user.id}#${a.cursor}`,
              GSI1pk: `ORG#${c.user.org}#TODOLIST#${a.todoListId}`,
              GSI1sk: `ACTIVE#${a.cursor}`
            }
          }
        }
        let todos = await TodoTable.query(pk, options)
        return todos.Items
      } else {
        let timeInMs, payload, relevantKSUID
        if (a.olderThan || a.earlierThan) {
          timeInMs = Date.now() - 86400 * 1000 * (a.olderThan || a.earlierThan)
          payload = crypto.randomBytes(16)
          relevantKSUID = KSUID.fromParts(timeInMs, payload)
        }

        let baseOptions = {
          index: 'GSI3',
          beginsWith: 'ACTIVE#',
          limit: 3
        }

        let options = baseOptions
        if (a.olderThan) {
          options = {
            ...baseOptions,
            lt: relevantKSUID.string
          }
        }

        if (a.earlierThan) {
          options = {
            ...baseOptions,
            gt: relevantKSUID.string
          }
        }

        if (a.priority) {
          options = {
            ...options,
            filters: [
              ...baseOptions.filters,
              { attr: 'priority', eq: a.priority }
            ]
          }
        }
        if (a.pinned) {
          options = {
            ...options,
            filters: { attr: 'pinned', eq: true }
          }
        }
        if (a.cursor) {
          options = {
            ...options,
            startKey: {
              pk: `ORG#${c.user.org}`,
              sk: `TODO#${c.user.id}#${a.cursor}`,
              GSI3pk: `ORG#${c.user.org}`,
              GSI3sk: `ACTIVE#${a.cursor}`
            }
          }
        }
        let todos = await TodoTable.query(`ORG#${c.user.org}`, options)
        return todos.Items
      }
    },
    todoList: async (p, a, c) => {
      // get queries are auto prefixed with stated prefix
      let todoList = await TodoList.get({
        pk: c.user.id,
        sk: a.id
      })
      return todoList.Item
    },
    todoLists: async (p, a, c) => {
      let todoLists = await TodoList.query(`ORG#${c.user.org}`, {
        beginsWith: 'TODOLIST#'
      })
      return todoLists.Items
    },
    todo: async (p, a, c) => {
      let { id } = a
      let todo = await Todo.get({ org: c.user.org, sk: `${c.user.id}#${id}` })
      return todo.Item
    }
  },
  Mutation: {
    addTodoList: async (p, a, c) => {
      let { todoList } = a
      const ksuid = await KSUID.random()
      const id = ksuid.string
      await TodoList.put({
        ...todoList,
        org: c.user.org,
        user: c.user.id,
        id,
        deleted: false,
        GSI1pk: `ORG#${c.user.org}#TODOLIST#${id}`,
        GSI1sk: id
      })
      return {
        ...todoList,
        id,
        user: c.user.id,
        org: c.user.org,
        activeTodosVolume: 0,
        completedTodosVolume: 0
      }
    },
    updateTodoList: async (p, a, c) => {
      let { todoList } = a
      delete todoList['activeTodosVolume']
      delete todoList['completedTodosVolume']
      await TodoList.update({
        ...todoList,
        GSI1pk: `ORG#${c.user.org}#TODOLIST#${todoList.id}`,
        GSI1sk: todoList.id
      })
      return todoList
    },
    addTodo: async (p, a, c) => {
      let { todo } = a
      let { todoListId, status } = todo
      const ksuid = await KSUID.random()
      const id = ksuid.string
      await Todo.put({
        ...todo,
        org: c.user.org,
        user: c.user.id,
        id,
        GSI1pk: `ORG#${c.user.org}#TODOLIST#${todoListId}`,
        GSI1sk: `${status}#${id}`,
        GSI3pk: `ORG#${c.user.org}`,
        GSI3sk: `${status}#${id}`
      })
      return {
        ...todo,
        id,
        createdSince: 'Just now',
        user: c.user.id,
        commentsCount: 0
      }
    },
    updateTodo: async (p, a, c) => {
      let { todo } = a
      let { id, todoListId, status } = todo
      delete todo['createdSince']
      delete todo['commentsCount']
      delete todo['comments']
      delete todo['todoListName']
      await Todo.update({
        ...todo,
        org: c.user.org,
        GSI1pk: `ORG#${c.user.org}#TODOLIST#${todoListId}`,
        GSI1sk: `${status}#${id}`,
        GSI3pk: `ORG#${c.user.org}`,
        GSI3sk: `${status}#${id}`
      })
      return todo
    },
    addComment: async (p, a, c) => {
      const { comment } = a
      const { todoId } = comment
      const ksuid = await KSUID.random()
      const id = ksuid.string
      const user = c.user.id
      await Comment.put({
        ...comment,
        id,
        user,
        sk: id,
        GSI2pk: `TODO#${todoId}#COMMENT`,
        GSI2sk: id
      })
      return { ...comment, createdAt: 'Just now', id, user }
    }
  },
  TodoList: {
    activeTodos: async (todoList, a, c) => {
      let pk = `ORG#${c.user.org}#TODOLIST#${todoList.id}`
      let todos = await TodoTable.query(pk, {
        index: 'GSI1',
        reverse: true,
        beginsWith: 'ACTIVE#'
      })
      return todos.Items
    },
    completedTodos: async (todoList, a, c) => {
      let pk = `ORG#${c.user.org}#TODOLIST#${todoList.id}`
      let todos = await TodoTable.query(pk, {
        index: 'GSI1',
        reverse: true,
        beginsWith: 'COMPLETED#'
      })
      return todos.Items
    },
    deletedTodos: async (todoList, a, c) => {
      let pk = `ORG@${c.user.org}#TODOLIST#${todoList.id}`
      let todos = await TodoTable.query(pk, {
        index: 'GSI1',
        reverse: true,
        beginsWith: 'DELETED#'
      })
      return todos.Items
    },
    activeTodosVolume: async (todoList, a, c) => {
      let pk = `ORG#${c.user.org}#TODOLIST#${todoList.id}`
      let todos = await TodoTable.query(pk, {
        index: 'GSI1',
        reverse: true,
        beginsWith: 'ACTIVE#'
      })
      return todos.Items.length
    },
    completedTodosVolume: async (todoList, a, c) => {
      let pk = `ORG#${c.user.org}#TODOLIST#${todoList.id}`
      let todos = await TodoTable.query(pk, {
        index: 'GSI1',
        reverse: true,
        beginsWith: 'COMPLETED#'
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
    todoListName: async (todo, a, c) => {
      let result = await TodoList.get({
        org: c.user.org,
        id: todo.todoListId
      })
      return result.Item.name
    },
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
