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
  DeletedTodos as DELETED_TODOS_QUERY
} from '../../queries/index'
import withApollo from '../../lib/withApollo'

const TodoFetcher = ({ id }) => {
  const { loading, error, data } = useQuery(DELETED_TODOS_QUERY, {
    fetchPolicy: 'cache-first',
    variables: { id }
  })
  if (loading || !data) return <Loading />
  if (error) return 'Error'
  return <TodoPage id={id} data={data} />
}

const TodoPage = ({ data, id }) => {
  const [updateTodo] = useMutation(UPDATE_TODO)
  let {
    todoList: { name, deletedTodos }
  } = data

  return (
    <Container>
      <Back title={`Deleted todos for ${name}`} />
      {deletedTodos.length > 0 ? (
        <TodoList parentId={id} updateTodo={updateTodo} todos={deletedTodos} />
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
