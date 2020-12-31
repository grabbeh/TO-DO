import { useQuery } from '@apollo/client'
import { MainContainer as Container } from '../../components/index'
import { Todo as TODO_QUERY } from '../../queries/index'
import withApollo from '../../lib/withApollo'
import Comments from '../../components/commentsStandalone'
import Loading from '../../components/loading'
import { Back, Header } from '../../components/index'

const CommentsFetcher = props => {
  let { id } = props
  const { loading, error, data } = useQuery(TODO_QUERY, {
    fetchPolicy: 'cache-first',
    variables: { id }
  })
  if (loading || !data) return <Loading />
  if (error) return 'Error'
  return <TodoPage todoId={id} data={data} />
}

const TodoPage = ({ data, todoId }) => {
  let {
    todo: { text, comments }
  } = data
  return (
    <Container>
      <Back title={text} />
      <Comments comments={comments} todoId={todoId} />
    </Container>
  )
}

const Apollo = withApollo({ ssr: true })(CommentsFetcher)

Apollo.getInitialProps = async ({ query }) => {
  return { id: query.id }
}

export default Apollo
