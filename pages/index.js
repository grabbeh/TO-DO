import { useMutation, useLazyQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import { Loading, TodoLists, TodoList, Comments } from '../components/index'
import { Menu } from '../components/icons/index'
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
  const [showComments, setShowComments] = useState(false)
  console.log(showComments)
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
    <div className='flex w-full bg-red-500 flex-wrap'>
      <TodoLists
        setShowSideBar={setShowSideBar}
        showSideBar={showSideBar}
        getTodos={getTodos}
      />
      <div className='l-0 md:mx-8 flex-grow'>
        <div
          className='cursor-pointer h-6 w-6 inline-block md:hidden'
          onClick={() => {
            setShowSideBar(!showSideBar)
          }}
        >
          <Menu />
        </div>
        {todosLoading || !todosData ? (
          <Loading />
        ) : (
          <TodoList
            setShowComments={setShowComments}
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
        <Comments
          showComments={showComments}
          setShowComments={setShowComments}
          todo={activeTodo}
          comments={commentsData.todo.comments}
        />
      )}
    </div>
  )
}

const Apollo = withApollo({ ssr: true })(TodoPage)
export default Apollo
