import { useQuery } from '@apollo/client'
import { MainContainer as Container } from '../../components/index'
import { Todo as TODO_QUERY } from '../../queries/index'
import withApollo from '../../lib/withApollo'
import Comments from '../../components/commentsStandalone'
import Loading from '../../components/loading'

const CommentsFetcher = props => {
  const { loading, error, data } = useQuery(TODO_QUERY, {
    fetchPolicy: 'cache-first',
    variables: { id: props.id }
  })
  if (loading || !data) return <Loading />
  if (error) return 'Error'
  return <TodoPage data={data} />
}

const TodoPage = ({ data }) => {
  let {
    todo: { text, id, comments }
  } = data
  return (
    <Container>
      <Comments text={text} comments={comments} todoId={id} />
    </Container>
  )
}

const Apollo = withApollo({ ssr: true })(CommentsFetcher)

Apollo.getInitialProps = async ({ query }) => {
  return { id: query.id }
}

export default Apollo
