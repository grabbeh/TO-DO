import { useQuery, useMutation } from '@apollo/client'
import {
  MainContainer as Container,
  Loading,
  TodoList,
  Back
} from '../components/index'
import {
  AllTodos as ALLTODOS_QUERY,
  UpdateTodo as UPDATE_TODO
} from '../queries/index'
import withApollo from '../lib/withApollo'

const TodoPage = () => {
  const [updateTodo] = useMutation(UPDATE_TODO)
  return (
    <Container>
      <Back title='All todos' />
      <Latest updateTodo={updateTodo} />
      <OlderThanSevenDays updateTodo={updateTodo} />
    </Container>
  )
}

const Latest = ({ updateTodo }) => {
  const { loading, error, data } = useQuery(ALLTODOS_QUERY, {
    fetchPolicy: 'cache-first',
    variables: { earlierThan: 1 }
  })
  if (loading || !data) return <Loading />
  if (error) return 'Error'
  return (
    <TodoList
      title='Recently added'
      updateTodo={updateTodo}
      todos={data.allTodos}
    />
  )
}

const OlderThanSevenDays = ({ updateTodo }) => {
  const { loading, error, data } = useQuery(ALLTODOS_QUERY, {
    fetchPolicy: 'cache-first',
    variables: { olderThan: 3 }
  })
  if (loading || !data) return <Loading />
  if (error) return 'Error'
  return (
    <TodoList
      title='3 days or older'
      updateTodo={updateTodo}
      todos={data.allTodos}
    />
  )
}

const Apollo = withApollo({ ssr: true })(TodoPage)
export default Apollo
