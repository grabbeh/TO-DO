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
    GSI2: { partitionKey: 'GSI2pk', sortKey: 'GSI2sk' },
    GSI3: { partitionKey: 'GSI3pk', sortKey: 'GSI3sk' }
  },
  DocumentClient
})

const TodoList = new Entity({
  name: 'TodoList',
  attributes: {
    org: { partitionKey: true, prefix: 'ORG#' },
    id: { sortKey: true, prefix: 'TODOLIST#' },
    user: { type: 'string' },
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
    org: { partitionKey: true, prefix: 'ORG#' },
    sk: { sortKey: true, prefix: 'TODO#' },
    user: ['sk', 0, { type: 'string' }],
    status: { type: 'string' },
    id: ['sk', 1],
    todoListId: { type: 'string' },
    todoListName: { type: 'string' },
    text: { type: 'string' },
    priority: { type: 'string' },
    contact: { type: 'string' },
    pinned: { type: 'boolean', default: false },
    GSI1pk: { type: 'string' },
    GSI1sk: { type: 'string' },
    GSI3pk: { type: 'string' },
    GSI3sk: { type: 'string' }
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
