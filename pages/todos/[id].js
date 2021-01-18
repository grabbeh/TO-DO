import { useQuery, useMutation } from '@apollo/client'
import _ from 'lodash'
import {
  MainContainer as Container,
  Back,
  Button,
  Loading,
  TodoList
} from '../../components/index'
import { Dustbin } from '../../components/icons'
import {
  UpdateTodo as UPDATE_TODO,
  Todos as TODOS_QUERY
} from '../../queries/index'
import withApollo from '../../lib/withApollo'
import Link from 'next/link'

const TodoFetcher = ({ id }) => {
  const { loading, error, data } = useQuery(TODOS_QUERY, {
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
    todoList: { name, todos }
  } = data
  todos = todos.filter(t => !t.deleted)
  let nonCompleted = todos.filter(t => !t.completed)
  let completed = todos.filter(t => t.completed)

  return (
    <Container>
      <Back title={name} />
      <TodoList parentId={id} updateTodo={updateTodo} todos={nonCompleted} />
      {completed.length > 0 && (
        <TodoList
          title='Completed'
          parentId={id}
          updateTodo={updateTodo}
          todos={completed}
        />
      )}
      <div className='mt-2 flex justify-between'>
        <Link href={`/deleted/${encodeURIComponent(id)}`}>
          <a>
            <div className='h-8 w-8'>
              <Dustbin />
            </div>
          </a>
        </Link>
        <Button>
          <Link href={`/add-todo/${encodeURIComponent(id)}`}>
            <a className='mt-4 cursor-pointer font-bold'>Add</a>
          </Link>
        </Button>
      </div>
    </Container>
  )
}

const Apollo = withApollo({ ssr: true })(TodoFetcher)

Apollo.getInitialProps = async ({ query }) => {
  return { id: query.id }
}

export default Apollo
