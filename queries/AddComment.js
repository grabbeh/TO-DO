import gql from 'graphql-tag'

export default gql`
  mutation addComment($comment: CommentInput) {
    addComment(comment: $comment) {
      text
      id
      user
      todoId
    }
  }
`
