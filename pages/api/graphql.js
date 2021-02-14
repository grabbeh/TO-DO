import { ApolloServer } from 'apollo-server-micro'
import resolvers from '../../server/resolvers.js'
import typeDefs from '../../server/schema.js'
import dotenv from 'dotenv'
dotenv.config({ path: '../../.env' })

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: {
    user: { id: 'mbg@outlook.com', orgId: '1234' }
  }
})

export const config = {
  api: {
    bodyParser: false
  }
}

export default apolloServer.createHandler({ path: '/api/graphql' })

const omitDeep = (value, key) => {
  if (Array.isArray(value)) {
    return value.map(i => omitDeep(i, key))
  } else if (typeof value === 'object' && value !== null) {
    return Object.keys(value).reduce((newObject, k) => {
      if (k == key) return newObject
      return Object.assign({ [k]: omitDeep(value[k], key) }, newObject)
    }, {})
  }
  return value
}
