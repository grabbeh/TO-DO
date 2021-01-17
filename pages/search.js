import { useQuery, useMutation } from '@apollo/client'
import {
  MainContainer as Container,
  Loading,
  TodoList,
  Back
} from '../components/index'
import {
  TodosByDate as TODOSBYDATE_QUERY,
  UpdateTodo as UPDATE_TODO
} from '../queries/index'
import withApollo from '../lib/withApollo'

const TodoPage = () => {
  const [updateTodo] = useMutation(UPDATE_TODO)
  return (
    <Container>
      <Back title='Todos' />
      <Latest updateTodo={updateTodo} />
      <OlderThanSevenDays updatedTodo={updateTodo} />
    </Container>
  )
}

const Latest = ({ updateTodo }) => {
  const { loading, error, data } = useQuery(TODOSBYDATE_QUERY, {
    fetchPolicy: 'cache-first',
    variables: { earlierThan: 1 }
  })
  if (loading || !data) return <Loading />
  if (error) return 'Error'
  return (
    <TodoList
      title='Recently added'
      updateTodo={updateTodo}
      todos={data.todosByDate}
    />
  )
}

const OlderThanSevenDays = ({ updateTodo }) => {
  const { loading, error, data } = useQuery(TODOSBYDATE_QUERY, {
    fetchPolicy: 'cache-first',
    variables: { olderThan: 7 }
  })
  if (loading || !data) return <Loading />
  if (error) return 'Error'
  return (
    <TodoList
      title='7 days or older'
      updateTodo={updateTodo}
      todos={data.todosByDate}
    />
  )
}

const Apollo = withApollo({ ssr: true })(TodoPage)
export default Apollo
