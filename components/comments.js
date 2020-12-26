const Comments = ({ comments }) => (
  <div className='mr-5'>
    <ul>
      {comments.map(comment => (
        <Comment comment={comment} key={comment.id} />
      ))}
    </ul>
  </div>
)

const Comment = props => {
  let { comment } = props
  return (
    <li key={comment.id}>
      <div className='pb-2 flex content-center'>
        <div className='flex flex-grow'>
          <div>{comment.text}</div>
        </div>
      </div>
    </li>
  )
}

export default Comments
