import { useQuery, useMutation, useLazyQuery } from '@apollo/client'
import { useEffect } from 'react'
import { Loading, TodoLists, TodoList, SearchForm } from '../components/index'
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
    console.log('Triggered')
    getTodos()
  }, [getTodos])
  if (todosLoading || !todosData) return <Loading />

  return (
    <div className='flex w-full bg-pink-200 flex-wrap'>
      <div className='flex flex-shrink'>
        <TodoLists todoLists={todoLists} />
      </div>

      <div className='flex flex-grow ml-6'>
        <TodoList
          title='Oldest'
          updateTodo={updateTodo}
          todos={todosData.allTodos}
        />
      </div>
      <div className='flex justify-end'>
        <SearchForm getTodos={getTodos} />
      </div>
    </div>
  )
}

const Apollo = withApollo({ ssr: true })(TodoFetcher)
export default Apollo
