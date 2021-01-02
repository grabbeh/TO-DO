import { useQuery } from '@apollo/client'
import { MainContainer as Container } from '../components/index'
import { TodoLists as TODO_LISTS_QUERY } from '../queries/index'
import withApollo from '../lib/withApollo'
import TodoLists from '../components/todoListsStandalone'
import Loading from '../components/loading'

const TodoFetcher = () => {
  const { loading, error, data } = useQuery(TODO_LISTS_QUERY, {
    fetchPolicy: 'cache-first'
  })
  if (loading || !data) return <Loading />
  if (error) return 'Error'
  return <TodoPage todoLists={data.todoLists} />
}

const TodoPage = ({ todoLists }) => {
  return (
    <Container>
      <TodoLists todoLists={todoLists} />
    </Container>
  )
}

const Apollo = withApollo({ ssr: true })(TodoFetcher)
export default Apollo
