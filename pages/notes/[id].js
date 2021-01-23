import { useQuery } from '@apollo/client'
import {
  MainContainer as Container,
  Loading,
  Back,
  Card
} from '../../components/index'
import { TodoNotes as TODO_NOTES_QUERY } from '../../queries/index'
import withApollo from '../../lib/withApollo'
import Comments from '../../components/commentsStandalone'

const CommentsFetcher = ({ id }) => {
  const { loading, error, data } = useQuery(TODO_NOTES_QUERY, {
    fetchPolicy: 'cache-first',
    variables: { id }
  })
  if (loading || !data) return <Loading />
  if (error) return 'Error'
  return <TodoPage todoId={id} data={data} />
}

const TodoPage = ({
  data: {
    todo: { text, comments, commentsCount }
  },
  todoId
}) => (
  <Container>
    <div className='flex justify-between'>
      <Back title={text} />
      <div className='text-2xl font-bold mt-3'>{commentsCount}</div>
    </div>
    <Card>
      <Comments comments={comments} todoId={todoId} />
    </Card>
  </Container>
)

const Apollo = withApollo({ ssr: true })(CommentsFetcher)

Apollo.getInitialProps = async ({ query }) => {
  return { id: query.id }
}

export default Apollo
