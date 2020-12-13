import { ApolloServer } from 'apollo-server-micro'
import resolvers from '../../server/resolvers.js'
import typeDefs from '../../server/schema.js'
import dotenv from 'dotenv'
dotenv.config({ path: '../../.env' })

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers
})

export const config = {
  api: {
    bodyParser: false
  }
}

export default apolloServer.createHandler({ path: '/api/graphql' })
