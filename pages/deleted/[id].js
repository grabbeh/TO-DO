import { useQuery, useMutation } from '@apollo/client'
import _ from 'lodash'
import {
  MainContainer as Container,
  Back,
  TodoList,
  Loading,
  Subheader
} from '../../components/index'
import {
  UpdateTodo as UPDATE_TODO,
  Todos as TODOS_QUERY
} from '../../queries/index'
import withApollo from '../../lib/withApollo'

const TodoFetcher = ({ id }) => {
  const { loading, error, data } = useQuery(TODOS_QUERY, {
    fetchPolicy: 'cache-first',
    variables: { id, status: 'deleted' }
  })
  if (loading || !data) return <Loading />
  if (error) return 'Error'
  return <TodoPage id={id} data={data} />
}

const TodoPage = ({ data, id }) => {
  console.log(data)
  const [updateTodo] = useMutation(UPDATE_TODO)
  let {
    todoList: { name, todos }
  } = data
  todos = todos.filter(t => t.deleted)

  return (
    <Container>
      <Back title={`Deleted todos for ${name}`} />
      {todos.length > 0 ? (
        <TodoList parentId={id} updateTodo={updateTodo} todos={todos} />
      ) : (
        <Subheader>No deleted todos</Subheader>
      )}
    </Container>
  )
}

const Apollo = withApollo({ ssr: true })(TodoFetcher)

Apollo.getInitialProps = async ({ query }) => {
  return { id: query.id }
}

export default Apollo
