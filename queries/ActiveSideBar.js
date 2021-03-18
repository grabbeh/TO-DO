import gql from 'graphql-tag'

const ActiveSideBar = gql`
  query ActiveSideBar {
    activeSideBar @client
  }
`

export default ActiveSideBar
