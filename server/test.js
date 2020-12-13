import { Table, Entity } from 'dynamodb-toolbox'
import dotenv from 'dotenv'
import AWS from 'aws-sdk'
import DynamoDB from 'aws-sdk/clients/dynamodb.js'
dotenv.config({ path: '../.env' })
AWS.config.update({
  region: 'eu-west-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

const DocumentClient = new DynamoDB.DocumentClient({
  apiVersion: '2012-08-10'
})

const MyTable = new Table({
  // Specify table name (used by DynamoDB)
  name: 'todos',
  // Define partition and sort keys
  partitionKey: 'pk',
  sortKey: 'sk',
  // Add the DocumentClient
  DocumentClient
})

const Customer = new Entity({
  // Specify entity name
  name: 'Customer',
  // Define attributes
  attributes: {
    id: { partitionKey: true }, // flag as partitionKey
    sk: { hidden: true, sortKey: true }, // flag as sortKey and mark hidden
    name: { map: 'data' }, // map 'name' to table attribute 'data'
    co: { alias: 'company' }, // alias table attribute 'co' to 'company'
    age: { type: 'number' }, // set the attribute type
    status: ['sk', 0], // composite key mapping
    date_added: ['sk', 1] // composite key mapping
  },

  // Assign it to our table
  table: MyTable
})

export { MyTable, Customer }
