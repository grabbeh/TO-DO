import gql from 'graphql-tag'

const ActiveCommentsBar = gql`
  query ActiveCommentsBar {
    activeCommentsBar @client
  }
`

export default ActiveCommentsBar
