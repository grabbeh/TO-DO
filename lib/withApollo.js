import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
  makeVar
} from '@apollo/client'
import { onError } from 'apollo-link-error'
import fetch from 'isomorphic-fetch'
import server from './server'
import { withApollo } from 'next-apollo'

if (!process.browser) {
  global.fetch = fetch
}

export const activeCategoryVar = makeVar('Oldest')
export const activeTodoVar = makeVar()
export const activeSideBarVar = makeVar(false)
export const activeCommentsBarVar = makeVar(false)

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        activeSideBar: {
          read () {
            return activeSideBarVar()
          }
        },
        activeCommentsBar: {
          read () {
            return activeCommentsBarVar()
          }
        },
        activeCategory: {
          read () {
            return activeCategoryVar()
          }
        },
        activeTodo: {
          read () {
            return activeTodoVar()
          }
        },
        allTodos: {
          keyArgs: ['id', 'pinned', 'oldest', 'newest'],
          // Concatenate the incoming list items with
          // the existing list items.
          merge (existing = [], incoming) {
            return [...existing, ...incoming]
          }
        }
        /*todo (_, { args, toReference }) {
          return toReference({
            __typename: 'Todo',
            id: args.id
          })
        }
        /*
        todoList (_, { args, toReference }) {
          return toReference({
            __typename: 'TodoList',
            id: args.id
          })
        }*/
      }
    }
  }
})

const httpLink = new HttpLink({
  uri: `${server}/api/graphql`,
  credentials: 'same-origin'
})

const cleanTypenameLink = new ApolloLink((operation, forward) => {
  if (operation.variables) {
    operation.variables = omitDeep(operation.variables, '__typename')
  }
  return forward(operation).map(data => {
    return data
  })
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

const appLink = ApolloLink.from([cleanTypenameLink, errorLink, httpLink])

const apolloClient = new ApolloClient({
  link: appLink,
  cache
})

export default withApollo(apolloClient)

const omitDeep = (obj, key) => {
  const keys = Object.keys(obj)
  const newObj = {}
  keys.forEach(i => {
    if (i !== key) {
      const val = obj[i]
      if (val instanceof Date) newObj[i] = val
      else if (Array.isArray(val)) newObj[i] = omitDeepArrayWalk(val, key)
      else if (typeof val === 'object' && val !== null)
        newObj[i] = omitDeep(val, key)
      else newObj[i] = val
    }
  })
  return newObj
}

const omitDeepArrayWalk = (arr, key) => {
  return arr.map(val => {
    if (Array.isArray(val)) return this.omitDeepArrayWalk(val, key)
    else if (typeof val === 'object') return this.omitDeep(val, key)
    return val
  })
}
