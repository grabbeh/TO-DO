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
    }
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
  // create global secondary indexes to a) get toxic/active tweets and b) latest version
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1
  },
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
