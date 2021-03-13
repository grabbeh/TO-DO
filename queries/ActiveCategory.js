import gql from 'graphql-tag'

const ActiveCategory = gql`
  query ActiveCategory {
    activeCategory @client
  }
`

export default ActiveCategory
