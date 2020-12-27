import { GraphQLScalarType } from 'graphql'
import { Kind } from 'graphql/language'
import { Todo, TodoList, TodoTable, Comment } from './table.js'
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
    todoList: async (p, a, c) => {
      let pk = `USER#mbg@outlook.com#TODOLIST#${a.id}`
      let todoList = await TodoTable.query(pk, {
        beginsWith: 'TODOLIST#',
        index: 'GSI1'
      })
      return todoList.Items[0]
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
      return todo
    },
    todos: async (p, a, c) => {
      let pk = `USER#mbg@outlook.com#TODOLIST#${a.id}`
      let todos = await TodoTable.query(pk, {
        beginsWith: 'TODO#',
        index: 'GSI1'
      })
      return todos.Items
    },
    comments: async (p, a, c) => {
      let pk = `USER#mbg@outlook.com#TODO#${a.id}`
      let comments = await TodoTable.query(pk, {
        beginsWith: 'COMMENT#',
        index: 'GSI2'
      })
      return comments.Items
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
      let { todoList } = a
      await TodoList.put({
        ...todoList,
        GSI1pk: `USER#mbg@outlook.com#TODOLIST#${a.id}`,
        GSI1pk: `TODOLIST#${a.id}`
      })
      return todoList
    },
    addTodo: async (p, a, c) => {
      let { todo } = a
      let { id, todoListId } = todo
      await Todo.put({
        ...todo,
        id,
        sk: id,
        GSI1pk: `USER#mbg@outlook.com#TODOLIST#${todoListId}`,
        GSI1sk: `TODO#${id}`
      })
      // We don't store 'createdSince' in the DB because it's calculated on each request
      // as relative to the time of creation
      return { ...todo, createdSince: 0, commentsCount: 0 }
    },
    updateTodo: async (p, a, c) => {
      let { todo } = a
      let { id, todoListId } = todo
      delete todo['createdSince']
      delete todo['commentsCount']
      delete todo['comments']
      await Todo.put({
        ...todo,
        pk: id,
        sk: id,
        GSI1pk: `USER#mbg@outlook.com#TODOLIST#${todoListId}`,
        GSI1sk: `TODO#${id}`
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
        GSI2pk: `USER#mbg@outlook.com#TODO#${todoId}`,
        GSI2sk: `COMMENT#${id}`
      })
      // We don't store 'createdSince' in the DB because it's calculated on each request
      // as relative to the time of creation
      return comment
    }
  },
  TodoList: {
    todos: async todoList => {
      let pk = `USER#mbg@outlook.com#TODOLIST#${todoList.id}`
      let todos = await TodoTable.query(pk, {
        beginsWith: 'TODO#',
        index: 'GSI1'
      })
      return todos.Items
    }
  },
  Todo: {
    createdSince: async todo => {
      let days = formatDistanceToNowStrict(new Date(todo.created), {
        unit: 'day'
      })
      let rating = days.slice(0, 1)
      return Number(rating)
    },
    commentsCount: async todo => {
      let pk = `USER#mbg@outlook.com#TODO#${todo.id}`
      let comments = await TodoTable.query(pk, {
        beginsWith: 'COMMENT#',
        index: 'GSI2'
      })
      return comments.Items.length
    },
    comments: async todo => {
      let pk = `USER#mbg@outlook.com#TODO#${todo.Item.id}`
      let comments = await TodoTable.query(pk, {
        beginsWith: 'COMMENT#',
        index: 'GSI2'
      })
      return comments.Items
    }
  }
}

export default resolvers
