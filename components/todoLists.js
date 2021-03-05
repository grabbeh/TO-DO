import { useState } from 'react'
import { useQuery } from '@apollo/client'
import {
  Button,
  TodoListOptionsBox,
  AddTodoListModal,
  AddTodoModal,
  Loading
} from './index'
import { Cross } from './icons/index'
import { TodoLists as TODO_LISTS_QUERY } from '../queries/index'
import { Plus } from './icons/index'
import Modal from 'react-modal'

const TodoLists = ({
  getTodos,
  setActiveTodoList,
  showSideBar,
  setShowSideBar
}) => {
  const { loading, error, data } = useQuery(TODO_LISTS_QUERY)
  if (loading || !data) return <Loading />
  if (error) return 'Error'
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const openModal = () => {
    setModalIsOpen(true)
  }

  const closeModal = () => {
    setModalIsOpen(false)
  }
  return (
    <div
      className={`${
        showSideBar ? 'inline-block absolute' : 'hidden'
      } md:inline-block mr-8 md:mr-0 md:sticky w-full md:w-56 flex-none h-full md:h-screen min-h-screen top-0 bg-purple-900`}
    >
      <div className='px-2 border-b-2 flex justify-between'>
        <h1 className='text-white text-xl my-2'>Lists</h1>
        <div
          className='h-8 w-8 cursor-pointer hover:text-white text-gray-200 md:hidden'
          onClick={() => setShowSideBar(false)}
        >
          <Cross />
        </div>
      </div>

      <ul className='px-2 mb-2'>
        <div
          className='cursor-pointer py-1 px-1 hover:bg-purple-800'
          onClick={() => {
            getTodos({ variables: { oldest: true } })
            setShowSideBar(false)
            setActiveTodoList('Oldest')
          }}
        >
          <span className='cursor-pointer flex text-md hover:text-white text-gray-200'>
            Oldest
          </span>
        </div>
        <div
          className='cursor-pointer py-1 px-1 hover:bg-purple-800'
          onClick={() => {
            getTodos({ variables: { newest: true } })
            setShowSideBar(false)
            setActiveTodoList('Newest')
          }}
        >
          <span className='cursor-pointer flex text-md hover:text-white text-gray-200'>
            Newest
          </span>
        </div>
        <div
          className='cursor-pointer py-1 px-1 hover:bg-purple-800'
          onClick={() => {
            getTodos({ variables: { pinned: true } })
            setShowSideBar(false)
            setActiveTodoList('Pinned')
          }}
        >
          <span className='cursor-pointer flex  text-md hover:text-white text-gray-200'>
            Pinned
          </span>
        </div>
        {data.todoLists.map(todoList => (
          <TodoList
            key={todoList.id}
            setShowSideBar={setShowSideBar}
            getTodos={getTodos}
            todoList={todoList}
          />
        ))}
      </ul>
      <div className='left-3 fixed bottom-2 mt-3 flex justify-end'>
        <Button onClick={openModal}>New todolist</Button>
        <Modal
          className='bg-white outline-none bottom-0 left-0 absolute rounded-t-lg border-2 px-2'
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel='Example Modal'
          closeTimeoutMS={500}
        >
          <AddTodoListModal closeModal={closeModal} />
        </Modal>
      </div>
    </div>
  )
}

const TodoList = ({ todoList, setShowSideBar, getTodos }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const openModal = () => {
    setModalIsOpen(true)
  }

  const closeModal = () => {
    setModalIsOpen(false)
  }
  return (
    <React.Fragment>
      {!todoList.deleted && (
        <div
          className='cursor-pointer py-1 px-1 hover:bg-purple-800'
          key={todoList.id}
        >
          <div className='flex'>
            <div className='flex-grow'>
              <div className='flex justify-between'>
                <span
                  onClick={() => {
                    getTodos({ variables: { id: todoList.id } })
                    setShowSideBar(false)
                  }}
                  className='cursor-pointer flex  text-md hover:text-white text-gray-200'
                >
                  {todoList.name}
                </span>
                <div className='flex'>
                  <div
                    className='cursor-pointer mt-1 h-5 w-5 hover:text-white text-gray-300'
                    onClick={openModal}
                  >
                    <Plus />
                  </div>
                  <Modal
                    closeTimeoutMS={500}
                    className='bg-white outline-none inset-x-0 bottom-0 m-auto absolute w-full rounded-t-lg lg:w-2/5 border-2 px-2'
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    contentLabel='Example Modal'
                  >
                    <AddTodoModal
                      closeModal={closeModal}
                      id={todoList.id}
                      name={todoList.name}
                    />
                  </Modal>
                  <div className='px-2 text-md text-right  hover:text-white text-gray-300'>
                    {todoList.activeTodosVolume}
                  </div>
                  <div>
                    <TodoListOptionsBox todoList={todoList} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  )
}

export default TodoLists
