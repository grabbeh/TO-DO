import { useState } from 'react'
import { useQuery } from '@apollo/client'
import {
  Button,
  TodoListOptionsBox,
  AddTodoListModal,
  AddTodoModal,
  Loading
} from './index'
import { TodoLists as TODO_LISTS_QUERY } from '../queries/index'
import { Plus } from './icons/index'
import Modal from 'react-modal'

const TodoLists = ({ getTodos }) => {
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
    <div className='px-2 md:sticky w-full md:w-56 flex-none h-full md:h-screen top-0 bg-blue-700'>
      <h1 className='text-white text-xl my-2 font-semibold'>Lists</h1>
      <ul className='mb-2'>
        <div
          className='cursor-pointer py-1 px-1 hover:bg-blue-600'
          onClick={() => {
            getTodos()
          }}
        >
          <span className='cursor-pointer flex font-semibold text-md hover:text-white text-gray-300'>
            Oldest
          </span>
        </div>
        <div
          className='cursor-pointer py-1 px-1 hover:bg-blue-600'
          onClick={() => {
            getTodos({ variables: { pinned: true } })
          }}
        >
          <span className='cursor-pointer flex font-semibold text-md hover:text-white text-gray-300'>
            Pinned
          </span>
        </div>
        {data.todoLists.map(todoList => (
          <TodoList key={todoList.id} getTodos={getTodos} todoList={todoList} />
        ))}
      </ul>
      <div className='fixed bottom-2 mt-3 flex justify-end'>
        <Button onClick={openModal}>Add</Button>
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

const TodoList = ({ todoList, getTodos }) => {
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
          className='cursor-pointer py-1 px-1 hover:bg-blue-600'
          key={todoList.id}
        >
          <div className='flex'>
            <div className='flex-grow'>
              <div className='flex justify-between'>
                <span
                  onClick={() => {
                    getTodos({ variables: { todoListId: todoList.id } })
                  }}
                  className='cursor-pointer flex font-semibold text-md hover:text-white text-gray-300'
                >
                  {todoList.name}
                </span>

                <div className='flex'>
                  <div
                    className='cursor-pointer h-5 w-5 hover:text-white text-gray-300'
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
                  <div className='px-2 text-md text-right font-semibold hover:text-white text-gray-300'>
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
