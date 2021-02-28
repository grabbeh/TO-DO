import { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import Modal from 'react-modal'
import { EditTodoModal } from './index'
import { Dustbin, Edit, Rewind } from './icons/index'
import { UpdateTodo as UPDATE_TODO } from '../queries/index'
import activateToast from '../utils/toast'

const TodoOptionsModal = ({ todo }) => {
  return (
    <div className='my-2'>
      <EditRow todo={todo} />
      <DeleteRow todo={todo} />
    </div>
  )
}

export default TodoOptionsModal

const EditRow = ({ todo }) => {
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
        className='bg-white outline-none inset-x-0 bottom-0 m-auto absolute w-full rounded-t-lg lg:w-2/5 border-2 py-2 px-2'
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel='Example Modal'
        closeTimeoutMS={500}
      >
        <EditTodoModal todo={todo} closeModal={closeModal} />
      </Modal>
    </div>
  )
}

const DeleteRow = ({ todo }) => {
  const [updateDeletionStatus] = useMutation(UPDATE_TODO, {
    update (cache, { data: { updateTodo } }) {
      let ref = { __ref: `Todo:${todo.id}` }
      if (updateTodo) {
        cache.modify({
          id: cache.identify({ id: todo.todoListId, __typename: 'TodoList' }),
          fields: {
            completedTodos (existing, { readField }) {
              // if todo exists in completed todos array and action is deleted then remove
              if (
                updateTodo.status === 'DELETED' &&
                existing.some(ref => readField('id', ref) === todo.id)
              ) {
                return existing.filter(ref => {
                  return todo.id !== readField('id', ref)
                })
                // if todo doesn't exist in array and action isn't deleted, then we should add to array
                // if todo is completed
              } else if (updateTodo.status !== 'DELETED') {
                return [ref, ...existing]
              } else {
                // if todo doesn't exist in array and action is deleted then item is in the other array so we return
                return existing
              }
            },
            activeTodos (existing, { readField }) {
              // if todo exists in completed todos array and action is deleted then remove
              if (
                updateTodo.status === 'DELETED' &&
                existing.some(ref => readField('id', ref) === todo.id)
              ) {
                return existing.filter(ref => {
                  return todo.id !== readField('id', ref)
                })
                // if todo doesn't exist in array and action isn't deleted, then we should add to array
                // if todo is incomplete
              } else if (updateTodo.status !== 'DELETED') {
                return [ref, ...existing]
              } else {
                // if todo doesn't exist in array and action is deleted then item is in the other array so we return
                return existing
              }
            },
            totalTodosVolume (value) {
              if (updateTodo.status === 'DELETED') {
                value++
              } else {
                value--
              }
              return value
            },
            completedTodosVolume (value) {
              if (updateTodo.status === 'COMPLETED') {
                value++
              } else {
                value--
              }
              return value
            }
          }
        })
      }
    }
  })

  return (
    <div
      className='py-2 text-blue-500 hover:text-blue-800 cursor-pointer'
      onClick={() => {
        let updatedTodo = {
          ...todo,
          status: todo.status === 'DELETED' ? 'COMPLETED' : 'ACTIVE'
        }
        let mutation = updateDeletionStatus({
          variables: {
            todo: updatedTodo
          },
          optimisticResponse: {
            __typename: 'Mutation',
            updateTodo: updatedTodo
          }
        })
        activateToast(mutation, 'Todo updated')
      }}
    >
      {todo.status === 'DELETED' ? (
        <div className='flex justify-center'>
          <div className='mr-3 h-6 w-6'>
            <Rewind />
          </div>
          <div>Undo</div>
        </div>
      ) : (
        <div className='font-semibold text-xl flex justify-center'>
          <div className='mr-3 h-6 w-6'>
            <Dustbin />
          </div>
          <div>Delete</div>
        </div>
      )}
    </div>
  )
}
