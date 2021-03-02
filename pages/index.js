import { useQuery, useMutation, useLazyQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import { Loading, TodoLists, TodoList, Comments } from '../components/index'
import {
  AllTodos as ALLTODOS_QUERY,
  UpdateTodo as UPDATE_TODO,
  TodoNotes as TODO_NOTES_QUERY
} from '../queries/index'
import withApollo from '../lib/withApollo'

const TodoPage = () => {
  const [updateTodo] = useMutation(UPDATE_TODO)
  const [activeTodo, setActiveTodo] = useState()
  const [showSideBar, setShowSideBar] = useState(false)
  const [
    getTodos,
    { loading: todosLoading, error: todosError, data: todosData, fetchMore }
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
      <TodoLists showSideBar={showSideBar} getTodos={getTodos} />
      <div className='l-0 md:mx-8 mt-8 flex-grow'>
        <div onClick={() => {setShowSideBar(!showSideBar)}}>Show</div>
        {todosLoading || !todosData ? (
          <Loading />
        ) : (
          <TodoList
            fetchMore={fetchMore}
            loading={todosLoading}
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

const Apollo = withApollo({ ssr: true })(TodoPage)
export default Apollo
