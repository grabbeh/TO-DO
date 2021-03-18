import { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import Modal from 'react-modal'
import { EditTodoListModal } from './index'
import { Dustbin, Edit } from './icons/index'
import { UpdateTodoList as UPDATE_TODOLIST } from '../queries/index'
import activateToast from '../utils/toast'

const TodoListOptionsModal = ({ todoList }) => {
  return (
    <div className='my-2'>
      <EditRow todoList={todoList} />
      <DeleteRow todoList={todoList} />
    </div>
  )
}

export default TodoListOptionsModal

const EditRow = ({ todoList }) => {
  const [modalIsOpen, setIsOpen] = useState(false)
  const openModal = () => {
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
  }
  useEffect(() => {
    document.body.style.overflow = 'unset'
    if (modalIsOpen) document.body.style.overflow = 'hidden'
  }, [modalIsOpen])
  return (
    <div>
      <div
        className='py-2 border-blue-500 border-b-2 flex justify-center font-semibold cursor-pointer text-xl text-blue-500 hover:text-blue-800'
        onClick={openModal}
      >
        <div className='mr-3 h-6 w-6'>
          <Edit />
        </div>
        <div>Edit</div>
      </div>

      <Modal
        className='bg-white outline-none left-0 bottom-0 m-auto absolute rounded-t-lg border-2 py-2 px-2'
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel='Example Modal'
        closeTimeoutMS={500}
      >
        <EditTodoListModal todoList={todoList} closeModal={closeModal} />
      </Modal>
    </div>
  )
}

const DeleteRow = ({ todoList }) => {
  const [updateTodoList] = useMutation(UPDATE_TODOLIST)
  return (
    <div
      onClick={() => {
        let updatedTodoList = {
          ...todoList,
          deleted: true
        }
        let mutation = updateTodoList({
          variables: {
            todoList: updatedTodoList
          }
        })
        activateToast(mutation, 'Todo list deleted')
      }}
    >
      <div className='py-2 text-blue-500 hover:text-black cursor-pointer font-semibold text-xl flex justify-center'>
        <div className='mr-3 h-6 w-6'>
          <Dustbin />
        </div>
        <div>Delete</div>
      </div>
    </div>
  )
}
