import gql from 'graphql-tag'

export default gql`
  query comments($id: ID!) {
    comments(id: $id) {
      text
      id
    }
  }
`
