import { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import Modal from 'react-modal'
import { EditTodoModal } from './index'
import { Dustbin, Edit, Rewind } from './icons/index'
import { UpdateTodo as UPDATE_TODO } from '../queries/index'
import toast from 'react-hot-toast'

const OptionsModal = ({ todo }) => {
  return (
    <div className='my-2'>
      <EditRow todo={todo} />
      <DeleteRow todo={todo} />
    </div>
  )
}

export default OptionsModal

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
                updateTodo.deleted &&
                existing.some(ref => readField('id', ref) === todo.id)
              ) {
                return existing.filter(ref => {
                  return todo.id !== readField('id', ref)
                })
                // if todo doesn't exist in array and action isn't deleted, then we should add to array
                // if todo is completed
              } else if (!updateTodo.deleted && updateTodo.completed) {
                return [ref, ...existing]
              } else {
                // if todo doesn't exist in array and action is deleted then item is in the other array so we return
                return existing
              }
            },
            activeTodos (existing, { readField }) {
              // if todo exists in completed todos array and action is deleted then remove
              if (
                updateTodo.deleted &&
                existing.some(ref => readField('id', ref) === todo.id)
              ) {
                return existing.filter(ref => {
                  return todo.id !== readField('id', ref)
                })
                // if todo doesn't exist in array and action isn't deleted, then we should add to array
                // if todo is incomplete
              } else if (!updateTodo.deleted && !updateTodo.completed) {
                return [ref, ...existing]
              } else {
                // if todo doesn't exist in array and action is deleted then item is in the other array so we return
                return existing
              }
            },
            deletedTodos (existing, { readField }) {
              // if action is deleted we add todo to array
              if (updateTodo.deleted) {
                return [ref, ...existing]
              } else {
                // else we filter out as it's being restored
                return existing.filter(ref => {
                  return todo.id !== readField('id', ref)
                })
              }
            },
            totalTodosVolume (value) {
              if (!updateTodo.deleted) {
                value++
              } else {
                value--
              }
              return value
            },
            completedTodosVolume (value) {
              if (updateTodo.completed && !updateTodo.deleted) {
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
          deleted: !todo.deleted
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
        toast.promise(mutation, {
          loading: 'Loading',
          success: data => `Todo updated`,
          error: err => `This just happened: ${err.toString()}`
        })
      }}
    >
      {todo.deleted ? (
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
