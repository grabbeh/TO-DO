import { useQuery, useMutation, useLazyQuery } from '@apollo/client'
import _ from 'lodash'
import {
  MainContainer as Container,
  Back,
  Button,
  Loading,
  TodoList,
  Tab,
  Tabs,
  TabList,
  TabPanels
} from '../../components/index'
import { Dustbin } from '../../components/icons'
import {
  UpdateTodo as UPDATE_TODO,
  Todos as TODOS_QUERY,
  CompletedTodos as COMPLETED_TODOS
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
  return <TodoPage id={id} todoList={data.todoList} />
}

const TodoPage = ({ todoList, id }) => {
  const [updateTodo] = useMutation(UPDATE_TODO)
  const [getCompleted, { loading, data }] = useLazyQuery(COMPLETED_TODOS)
  console.log(loading)
  let { name, activeTodos, activeTodosVolume, completedTodosVolume } = todoList
  return (
    <Container>
      <div className='flex justify-between'>
        <Back title={name} />
        <div className='mt-3 pr-3 lg:pr-0 text-2xl font-bold'>
          {completedTodosVolume} / {activeTodosVolume + completedTodosVolume}
        </div>
      </div>
      <Tabs>
        <TabList>
          <Tab>Active</Tab>
          <Tab>
            <div
              onClick={() => {
                getCompleted({
                  variables: { id }
                })
              }}
            >
              Completed
            </div>
          </Tab>
        </TabList>
        <TabPanels>
          <TodoList parentId={id} updateTodo={updateTodo} todos={activeTodos} />
          {loading && <Loading />}
          {data?.todoList?.completedTodos.length > 0 && (
            <TodoList
              parentId={id}
              updateTodo={updateTodo}
              todos={data.todoList.completedTodos}
            />
          )}
        </TabPanels>
      </Tabs>

      <div className='mt-2 flex justify-between'>
        <Link href={`/deleted/${encodeURIComponent(id)}`}>
          <a>
            <div className='h-8 w-8'>
              <Dustbin />
            </div>
          </a>
        </Link>
        <div className='pr-3 lg:pr-0'>
          <Button>
            <Link href={`/add-todo/${encodeURIComponent(id)}`}>
              <a className='mt-4 cursor-pointer font-bold'>Add</a>
            </Link>
          </Button>
        </div>
      </div>
    </Container>
  )
}

const CompletedTodosFetcher = () => {
  const [getCompleted, { loading, data }] = useLazyQuery(COMPLETED_TODOS)
}

const Apollo = withApollo({ ssr: true })(TodoFetcher)

Apollo.getInitialProps = async ({ query }) => {
  return { id: query.id }
}

export default Apollo
