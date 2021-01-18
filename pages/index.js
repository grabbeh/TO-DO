import { useQuery } from '@apollo/client'
import {
  MainContainer as Container,
  Loading,
  TodoLists
} from '../components/index'
import { TodoLists as TODO_LISTS_QUERY } from '../queries/index'
import withApollo from '../lib/withApollo'

const TodoFetcher = () => {
  const { loading, error, data } = useQuery(TODO_LISTS_QUERY, {
    fetchPolicy: 'cache-first'
  })
  if (loading || !data) return <Loading />
  if (error) return 'Error'
  console.log(data)
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
