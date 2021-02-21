import Link from 'next/link'
import { useState } from 'react'
import { Button, TodoListOptionsBox, AddTodoListModal } from './index'
import Modal from 'react-modal'

const TodoLists = ({ todoLists }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const openModal = () => {
    setModalIsOpen(true)
  }

  const closeModal = () => {
    setModalIsOpen(false)
  }
  return (
    <div className='px-2 sticky h-screen top-0 bg-blue-700 w-full md:w-48'>
      <h1 className='text-white text-2xl my-2 font-semibold'>Lists</h1>
      <ul>
        {todoLists.map(todoList => (
          <TodoList key={todoList.id} todoList={todoList} />
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

const TodoList = ({ todoList }) => (
  <React.Fragment>
    {!todoList.deleted && (
      <div className='cursor-pointer pb-1' key={todoList.id}>
        <div className='flex'>
          <div className='flex-grow'>
            <div className='flex justify-between'>
              <Link href={`/todos/${encodeURIComponent(todoList.id)}`}>
                <span className='cursor-pointer flex  text-white text-md'>
                  {todoList.name}
                </span>
              </Link>
              <div className='flex'>
                <div className='px-2 text-sm text-right font-semibold  text-gray-300'>
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

export default TodoLists
