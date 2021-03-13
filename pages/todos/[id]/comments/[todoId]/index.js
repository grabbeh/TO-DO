import { useMutation, useLazyQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import SplitPane from 'react-split-pane'
import Pane from 'react-split-pane/lib/Pane'
import {
  Loading,
  TodoLists,
  TodoList,
  Comments,
  Subheader
} from '../../../../../components/index'
import { Menu } from '../../../../../components/icons/index'
import { activeCategoryVar, activeTodoVar } from '../../../../../lib/withApollo'
import {
  AllTodos as ALLTODOS_QUERY,
  UpdateTodo as UPDATE_TODO,
  TodoNotes as TODO_NOTES_QUERY
} from '../../../../../queries/index'
import withApollo from '../../../../../lib/withApollo'
import { useRouter } from 'next/router'

const TodoPage = () => {
  const router = useRouter()
  const { id, todoId } = router.query
  const [updateTodo] = useMutation(UPDATE_TODO)
  const [showSideBar, setShowSideBar] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [
    getTodos,
    { loading: todosLoading, error: todosError, data: todosData, fetchMore }
  ] = useLazyQuery(ALLTODOS_QUERY)

  const [
    getComments,
    { loading: commentsLoading, error: commentsError, data: commentsData }
  ] = useLazyQuery(TODO_NOTES_QUERY)

  useEffect(() => {
    getTodos({ variables: { id } })
  }, [getTodos, id])

  useEffect(() => {
    getComments({ variables: { id: todoId } })
  }, [getComments, todoId])

  useEffect(() => {
    if (todosData) {
      activeCategoryVar(todosData.todoList.name)
    }
  }, [todosData])

  useEffect(() => {
    if (commentsData) {
      activeTodoVar(commentsData.todo)
      setShowComments(true)
    }
  }, [commentsData])

  return (
    <div>
      <SplitPane split='vertical'>
        <Pane maxSize='35%' initialSize='20%' minSize='15%'>
          <TodoLists
            setShowSideBar={setShowSideBar}
            showSideBar={showSideBar}
            getTodos={getTodos}
          />
        </Pane>
        <Pane maxWidth='85%' minSize='25%'>
          <div className='flex flex-col h-screen'>
            <div className='flex-grow-0'>
              <div
                className='cursor-pointer h-6 w-6 inline-block md:hidden'
                onClick={() => {
                  setShowSideBar(!showSideBar)
                }}
              >
                <Menu />
              </div>
              <div className='p-3 border-b'>
                <Subheader>{activeCategoryVar()}</Subheader>
              </div>
            </div>
            {todosLoading || !todosData ? (
              <Loading />
            ) : (
              <div className='flex-grow overflow-y-hidden relative'>
                <div className='absolute inset-0 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-300 scrollbar-thumb-rounded overflow-y-auto'>
                  <TodoList
                    setShowComments={setShowComments}
                    fetchMore={fetchMore}
                    loading={todosLoading}
                    getComments={getComments}
                    updateTodo={updateTodo}
                    todos={todosData.allTodos}
                  />
                </div>
              </div>
            )}
          </div>
        </Pane>
        {commentsLoading && (
          <div className='w-1/4'>
            <Loading />
          </div>
        )}
        {commentsData && showComments && (
          <Pane initialSize='25%'>
            <Comments
              showComments={showComments}
              setShowComments={setShowComments}
              comments={commentsData.todo.comments}
            />
          </Pane>
        )}
      </SplitPane>
    </div>
  )
}

const Apollo = withApollo({ ssr: true })(TodoPage)
export default Apollo
