import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'
import { onError } from 'apollo-link-error'
import fetch from 'isomorphic-fetch'
import server from './server'
import { withApollo } from 'next-apollo'

if (!process.browser) {
  global.fetch = fetch
}

const cache = new InMemoryCache({
  addTypename: false
})

const httpLink = new HttpLink({
  uri: `${server}/api/graphql`,
  credentials: 'same-origin'
})

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    )
  }

  if (networkError) console.log(`[Network error]: ${networkError}`)
})

const apolloClient = new ApolloClient({
  link: errorLink.concat(httpLink),
  cache
})

export default withApollo(apolloClient)
