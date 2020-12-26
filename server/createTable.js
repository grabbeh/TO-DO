import dotenv from 'dotenv'
import AWS from 'aws-sdk'
dotenv.config({ path: '../.env' })

AWS.config.update({
  region: 'eu-west-1',
  accessKeyId: '',
  secretAccessKey: ''
})

// Create the DynamoDB service object
var client = new AWS.DynamoDB({ apiVersion: '2012-08-10' })
var docClient = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' })
var params = {
  AttributeDefinitions: [
    {
      AttributeName: 'pk',
      AttributeType: 'S'
    },
    {
      AttributeName: 'sk',
      AttributeType: 'S'
    },
    { AttributeName: 'GSI1pk', AttributeType: 'S' },
    { AttributeName: 'GSI1sk', AttributeType: 'S' },
    { AttributeName: 'GSI2pk', AttributeType: 'S' },
    { AttributeName: 'GSI2sk', AttributeType: 'S' }
  ],
  KeySchema: [
    {
      AttributeName: 'pk',
      KeyType: 'HASH'
    },
    {
      AttributeName: 'sk',
      KeyType: 'RANGE'
    }
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1
  },
  GlobalSecondaryIndexes: [
    {
      IndexName: 'GSI1',
      KeySchema: [
        { AttributeName: 'GSI1pk', KeyType: 'HASH' },
        { AttributeName: 'GSI1sk', KeyType: 'RANGE' }
      ],
      Projection: {
        ProjectionType: 'ALL'
      },
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1
      }
    },
    {
      IndexName: 'GSI2',
      KeySchema: [
        { AttributeName: 'GSI2pk', KeyType: 'HASH' },
        { AttributeName: 'GSI2sk', KeyType: 'RANGE' }
      ],
      Projection: {
        ProjectionType: 'ALL'
      },
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1
      }
    }
  ],
  TableName: 'todos'
}

// Call DynamoDB to create the table
client.createTable(params, (err, data) => {
  if (err) {
    console.log('Error', err)
  } else {
    console.log('Table Created', data)
  }
})
