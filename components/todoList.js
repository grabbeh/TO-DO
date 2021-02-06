import { useMutation } from '@apollo/client'
import { useState } from 'react'
import Modal from 'react-modal'
import { CardListItem as Card, Subheader, EditTodoModal } from './index'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { Dustbin, Comments, Edit, Rewind } from './icons/index'
import { UpdateTodo as UPDATE_TODO } from '../queries/index'

const TodoList = ({ todos, title, updateTodo }) => (
  <div>
    {title && <Subheader>{title}</Subheader>}
    <ul className='mb-3 border-t-2 lg:border-l-2 lg:border-r-2'>
      {todos.map(todo => (
        <Todo key={todo.id} updateTodo={updateTodo} todo={todo} />
      ))}
    </ul>
  </div>
)

const Todo = ({ todo }) => {
  const [modalIsOpen, setIsOpen] = useState(false)
  const openModal = () => {
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
  }
  const [updateCompletionStatus] = useMutation(UPDATE_TODO, {
    update (cache, { data: { updateTodo } }) {
      let ref = { __ref: `Todo:${todo.id}` }
      cache.modify({
        id: cache.identify({
          id: todo.todoListId,
          __typename: 'TodoList'
        }),
        fields: {
          completedTodos (existing, { readField }) {
            if (updateTodo.completed) {
              return [ref, ...existing]
            } else {
              return existing.filter(ref => {
                return todo.id !== readField('id', ref)
              })
            }
          },
          activeTodos (existing, { readField }) {
            if (!updateTodo.completed) {
              return [ref, ...existing]
            } else {
              return existing.filter(ref => {
                return todo.id !== readField('id', ref)
              })
            }
          },
          completedTodosVolume (value) {
            if (updateTodo.completed) {
              value++
            } else {
              value--
            }
            return value
          },
          activeTodosVolume (value) {
            if (!updateTodo.completed) {
              value++
            } else {
              value--
            }
            return value
          }
        }
      })
    }
  })
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
    <Card key={todo.id}>
      <div className='flex'>
        <div>
          <label>
            <input
              type='checkbox'
              checked={todo.completed}
              onChange={() => {
                let mutation = updateCompletionStatus({
                  variables: {
                    todo: { ...todo, completed: !todo.completed }
                  },
                  optimisticResponse: {
                    type: 'Mutation',
                    updateTodo: { ...todo, completed: !todo.completed }
                  }
                })
                toast.promise(mutation, {
                  loading: 'Loading',
                  success: data => `Successfully updated todo`,
                  error: err => `This just happened: ${err.toString()}`
                })
              }}
              className='mr-3 cursor-pointer form-checkbox h-5 w-5 border-2 hover:form-checkbox border-gray-300 rounded-md checked:color-green-500 checked:bg-blue-600 checked:border-transparent focus:outline-none'
            />
          </label>
        </div>
        <div className='flex-grow'>
          <div className='flex justify-between'>
            <div className='pr-4'>
              <span
                className={`${
                  todo.completed ? 'line-through' : ''
                } flex font-bold text-gray-900 text-xl`}
              >
                {todo.text}
              </span>
              <div className='text-gray-500 text-xl font-semibold'>
                {todo.contact}
              </div>
            </div>
            <div>
              <div className='flex justify-end flex-shrink'>
                {todo.priority && <Rating priority={todo.priority} />}
              </div>
              <div className='flex justify-end text-base text-right font-semibold text-gray-500'>
                {todo.createdSince}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='flex self-end mt-2'>
        <div className='align-bottom justify-between flex-grow flex'>
          <div
            onClick={openModal}
            className='cursor-pointer text-blue-500 hover:text-blue-800 mr-2 h-5 w-5'
          >
            <Edit />
          </div>

          <Modal
            className='bg-white outline-none inset-x-0 bottom-0 m-auto absolute w-full rounded-t-lg lg:w-2/5 border-2 px-2'
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            contentLabel='Example Modal'
          >
            <EditTodoModal todo={todo} closeModal={closeModal} />
          </Modal>
          <div
            className='mr-2 h-5 w-5 text-blue-500 hover:text-blue-800 cursor-pointer'
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
                success: data => `Successfully updated todo`,
                error: err => `This just happened: ${err.toString()}`
              })
            }}
          >
            {todo.deleted ? <Rewind /> : <Dustbin />}
          </div>
          <div>
            <div className='cursor-pointer'>
              <Link href={`/notes/${encodeURIComponent(todo.id)}`}>
                <a>
                  <div className='flex hover:text-blue-800 text-blue-500'>
                    <div className='h-5 w-5'>
                      <Comments />
                    </div>
                    <div className=' ml-1 text-md font-bold'>
                      {todo.commentsCount}
                    </div>
                  </div>
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

const Rating = ({ priority }) => {
  let textColor = 'text-green-500'
  if (priority === 'medium') textColor = 'text-yellow-500'
  if (priority === 'high') textColor = 'text-red-500'
  return (
    <div className={`${textColor} font-bold bg-black-200 rounded`}>
      {priority.toUpperCase()}
    </div>
  )
}

const RemoveItem = (arr, item) => {
  let existingReference = { __ref: `Todo:${todo.id}` }
  if (updateTodo && !updateTodo.completed) {
    return [existingReference, ...existing]
  } else {
    return existing.filter(ref => {
      return todo.id !== readField('id', ref)
    })
  }
}

const UpdateTodos = (id, arr, add, readField) => {
  let existingReference = { __ref: `Todo:${id}` }
  if (add) {
    return [existingReference, ...arr]
  } else {
    return arr.filter(ref => {
      return id !== readField('id', ref)
    })
  }
}

export default TodoList
