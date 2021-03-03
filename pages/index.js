import { useMutation, useLazyQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import {
  Loading,
  TodoLists,
  TodoList,
  Comments,
  Button,
  AddTodoModal,
  Subheader
} from '../components/index'
import { Menu } from '../components/icons/index'
import {
  AllTodos as ALLTODOS_QUERY,
  UpdateTodo as UPDATE_TODO,
  TodoNotes as TODO_NOTES_QUERY
} from '../queries/index'
import withApollo from '../lib/withApollo'
import Modal from 'react-modal'

const TodoPage = () => {
  const [updateTodo] = useMutation(UPDATE_TODO)
  const [activeTodo, setActiveTodo] = useState()
  const [showSideBar, setShowSideBar] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const openModal = () => {
    setModalIsOpen(true)
  }

  const closeModal = () => {
    setModalIsOpen(false)
  }
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
      <TodoLists
        setShowSideBar={setShowSideBar}
        showSideBar={showSideBar}
        getTodos={getTodos}
      />
      <div className='l-0 md:mx-8 h-full min-h-screen flex-grow'>
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
            <div className='my-3 flex justify-between'>
              <Subheader>{todosData.allTodos[0].todoListName}</Subheader>
              <Button
                className='cursor-pointer mt-1 h-5 w-5 hover:text-white text-gray-300'
                onClick={openModal}
              >
                Add todo
              </Button>
              <Modal
                closeTimeoutMS={500}
                className='bg-white outline-none inset-x-0 bottom-0 m-auto absolute w-full rounded-t-lg lg:w-2/5 border-2 px-2'
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel='Example Modal'
              >
                <AddTodoModal
                  closeModal={closeModal}
                  id={todosData.allTodos[0].todoListId}
                  name={todosData.allTodos[0].todoListName}
                />
              </Modal>
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
