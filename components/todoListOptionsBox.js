import Modal from 'react-modal'
import { useState } from 'react'
import { TodoListOptionsModal } from './index'
import { VerticalDots } from './icons/index'

const TodoListOptionsBox = ({ todoList }) => {
  const [modalIsOpen, setIsOpen] = useState(false)
  const openModal = () => {
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
  }
  return (
    <div id='test' className='mt-1'>
      <div onClick={openModal}>
        <div className='flex cursor-pointer'>
          <div className='h-5 w-5'>
            <VerticalDots />
          </div>
        </div>
      </div>
      <Modal
        // parentSelector={() => document.querySelector('test')}
        className='bg-white relative outline-none rounded-t-lg border-2 px-2'
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
