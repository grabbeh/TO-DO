// Require AWS SDK and instantiate DocumentClient
import { Table, Entity } from 'dynamodb-toolbox'
import dotenv from 'dotenv'
import AWS from 'aws-sdk'
dotenv.config({ path: '../.env' })
AWS.config.update({
  region: 'eu-west-1',
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_KEY
})

const DocumentClient = new AWS.DynamoDB.DocumentClient()

// Instantiate a table
const TodoTable = new Table({
  name: 'todos',
  partitionKey: 'pk',
  sortKey: 'sk',
  indexes: {
    GSI1: { partitionKey: 'GSI1pk', sortKey: 'GSI1sk' },
    GSI2: { partitionKey: 'GSI2pk', sortKey: 'GSI2sk' }
  },
  DocumentClient
})

const TodoList = new Entity({
  name: 'TodoList',
  attributes: {
    user: { partitionKey: true, prefix: 'USER#', default: 'mbg@outlook.com' },
    id: { sortKey: true, prefix: 'TODOLIST#' },
    name: { type: 'string' },
    deleted: { type: 'boolean', default: false },
    GSI1pk: { type: 'string' },
    GSI1sk: { type: 'string' }
  },
  table: TodoTable
})

const Todo = new Entity({
  name: 'Todo',
  attributes: {
    id: { partitionKey: true, prefix: 'TODO#' },
    sk: { sortKey: true, prefix: 'TODO#' },
    todoListId: { type: 'string' },
    user: { type: 'string' },
    text: { type: 'string' },
    priority: { type: 'string' },
    contact: { type: 'string' },
    completed: { type: 'boolean', default: false },
    deleted: { type: 'boolean', default: false },
    position: { type: 'number' },
    GSI1pk: { type: 'string' },
    GSI1sk: { type: 'string' }
  },
  table: TodoTable
})

const Comment = new Entity({
  name: 'Comment',
  attributes: {
    id: { partitionKey: true, prefix: 'COMMENT#' },
    sk: { sortKey: true, prefix: 'COMMENT#' },
    text: { type: 'string' },
    user: { type: 'string' },
    todoId: 'string',
    GSI2pk: { type: 'string' },
    GSI2sk: { type: 'string' }
  },
  table: TodoTable
})

export { Comment, Todo, TodoList, TodoTable }
