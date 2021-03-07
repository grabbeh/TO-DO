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
} from '../components/index'
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
  const [activeTodoList, setActiveTodoList] = useState()
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
    getTodos()
    setActiveTodoList('Oldest')
  }, [getTodos])

  return (
    <SplitPane split='vertical'>
      <Pane maxSize='35%' initialSize='20%' minSize='15%'>
        <TodoLists
          setShowSideBar={setShowSideBar}
          setActiveTodoList={setActiveTodoList}
          showSideBar={showSideBar}
          getTodos={getTodos}
          activeTodoList={activeTodoList}
        />
      </Pane>
      <Pane maxWidth='85%' minSize='25%'>
        <div className='min-h-screen'>
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
            <div>
              <div className='px-3 flex justify-between'>
                <Subheader>{activeTodoList}</Subheader>
              </div>
              <TodoList
                setShowComments={setShowComments}
                fetchMore={fetchMore}
                loading={todosLoading}
                setActiveTodo={setActiveTodo}
                getComments={getComments}
                updateTodo={updateTodo}
                todos={todosData.allTodos}
              />
            </div>
          )}
        </div>
      </Pane>
      {commentsData && (
        <Pane initialSize='25%'>
          <Comments
            showComments={showComments}
            setShowComments={setShowComments}
            todo={activeTodo}
            comments={commentsData.todo.comments}
          />
        </Pane>
      )}
    </SplitPane>
  )
}

const Apollo = withApollo({ ssr: true })(TodoPage)
export default Apollo
