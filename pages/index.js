import { useQuery, useMutation, useLazyQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import {
  Loading,
  TodoLists,
  TodoList,
  Tab,
  Tabs,
  TabList,
  TabPanels,
  Comments
} from '../components/index'
import {
  TodoLists as TODO_LISTS_QUERY,
  AllTodos as ALLTODOS_QUERY,
  UpdateTodo as UPDATE_TODO,
  TodoNotes as TODO_NOTES_QUERY
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
  const [activeTodo, setActiveTodo] = useState()
  const [
    getTodos,
    { loading: todosLoading, error: todosError, data: todosData }
  ] = useLazyQuery(ALLTODOS_QUERY)

  const [
    getComments,
    { loading: commentsLoading, error: commentsError, data: commentsData }
  ] = useLazyQuery(TODO_NOTES_QUERY)

  useEffect(() => {
    getTodos()
  }, [getTodos])

  return (
    <div className='flex w-full bg-pink-200 flex-wrap'>
      <TodoLists getTodos={getTodos} todoLists={todoLists} />
      <div className='l-0 md:mx-8 mt-3 flex-grow'>
        {todosLoading || !todosData ? (
          <Loading />
        ) : (
          <TodoList
            setActiveTodo={setActiveTodo}
            getComments={getComments}
            updateTodo={updateTodo}
            todos={todosData.allTodos}
          />
        )}
      </div>
      {commentsData && (
        <Comments todo={activeTodo} comments={commentsData.todo.comments} />
      )}
    </div>
  )
}

const Apollo = withApollo({ ssr: true })(TodoFetcher)
export default Apollo
