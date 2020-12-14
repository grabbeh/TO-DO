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
const ToDoTable = new Table({
  name: 'todos',
  partitionKey: 'pk',
  sortKey: 'sk',
  DocumentClient
})

const ToDo = new Entity({
  name: 'ToDo',
  attributes: {
    user: { partitionKey: true, prefix: 'USER#' },
    id: { sortKey: true, prefix: 'TODO#' },
    text: { type: 'string' },
    completed: { type: 'boolean', default: false },
    deleted: { type: 'boolean', default: false },
    position: { type: 'number' }
  },
  table: ToDoTable
})

export { ToDo }
