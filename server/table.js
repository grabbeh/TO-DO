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
    GSI1: { partitionKey: 'GSI1pk', sortKey: 'GSI1sk' }
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
    pk: { partitionKey: true, prefix: 'TODO#' },
    sk: { sortKey: true, prefix: 'TODO#' },
    id: { type: 'string' },
    todoListId: { type: 'string' },
    user: { type: 'string' },
    text: { type: 'string' },
    completed: { type: 'boolean', default: false },
    deleted: { type: 'boolean', default: false },
    position: { type: 'number' },
    GSI1pk: { type: 'string' },
    GSI1sk: { type: 'string' }
  },
  table: TodoTable
})

export { Todo, TodoList, TodoTable }
