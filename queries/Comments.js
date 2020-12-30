import gql from 'graphql-tag'

export default gql`
  query comments($id: ID!) {
    text
    comments(id: $id) {
      text
      id
    }
  }
`
