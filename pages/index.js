import { useQuery, useMutation, useLazyQuery } from '@apollo/client'
import { useEffect } from 'react'
import {
  Loading,
  TodoLists,
  TodoList,
  SearchForm,
  Tab,
  Tabs,
  TabList,
  TabPanels,
  PinnedTodos
} from '../components/index'
import {
  TodoLists as TODO_LISTS_QUERY,
  AllTodos as ALLTODOS_QUERY,
  UpdateTodo as UPDATE_TODO
} from '../queries/index'
import withApollo from '../lib/withApollo'

const TodoFetcher = () => {
  const { loading: listLoading, error: listError, data: listData } = useQuery(
    TODO_LISTS_QUERY
  )

  if (listLoading || !listData) return <Loading />
  if (listError) return 'Error'
  return <TodoPage todoLists={listData.todoLists} />
}

const TodoPage = ({ todoLists }) => {
  const [updateTodo] = useMutation(UPDATE_TODO)
  const [
    getTodos,
    { loading: todosLoading, error: todosError, data: todosData }
  ] = useLazyQuery(ALLTODOS_QUERY)

  useEffect(() => {
    getTodos()
  }, [getTodos])

  return (
    <div className='flex w-full bg-pink-200 flex-wrap'>
      <TodoLists todoLists={todoLists} />
      <div className='l-0 md:mx-20 mt-3 flex-grow'>
        <Tabs>
          <TabList>
            <Tab>
              <div
                onClick={() => {
                  getTodos()
                }}
              >
                Oldest todos
              </div>
            </Tab>
            <Tab>
              <div
                onClick={() => {
                  getTodos({ variables: { pinned: true } })
                }}
              >
                Pinned todos
              </div>
            </Tab>
          </TabList>
          <TabPanels>
            {todosLoading || !todosData ? (
              <Loading />
            ) : (
              <TodoList updateTodo={updateTodo} todos={todosData.allTodos} />
            )}
            {todosLoading || !todosData ? (
              <Loading />
            ) : (
              <TodoList updateTodo={updateTodo} todos={todosData.allTodos} />
            )}
          </TabPanels>
        </Tabs>
      </div>
      <SearchForm getTodos={getTodos} />
    </div>
  )
}

const Apollo = withApollo({ ssr: true })(TodoFetcher)
export default Apollo
