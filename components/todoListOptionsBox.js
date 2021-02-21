import Modal from 'react-modal'
import { useState } from 'react'
import { TodoListOptionsModal } from './index'
import { Cog } from './icons/index'

const TodoListOptionsBox = ({ todoList }) => {
  const [modalIsOpen, setIsOpen] = useState(false)
  const openModal = () => {
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
  }
  return (
    <div>
      <div onClick={openModal}>
        <div className='flex cursor-pointer hover:text-white text-gray-300'>
          <div className='h-5 w-5'>
            <Cog />
          </div>
        </div>
      </div>
      <Modal
        className='bg-white outline-none bottom-0 left-0 absolute rounded-t-lg border-2 px-2'
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel='Example Modal'
        closeTimeoutMS={500}
      >
        <TodoListOptionsModal closeModal={closeModal} todoList={todoList} />
      </Modal>
    </div>
  )
}

export default TodoListOptionsBox
