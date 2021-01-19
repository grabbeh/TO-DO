import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { CardListItem as Card, Subheader } from './index'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { Dustbin, Comments, Edit, Rewind } from './icons/index'
import { UpdateTodo as UPDATE_TODO } from '../queries/index'

const TodoList = ({ todos, title, updateTodo }) => (
  <div>
    {title && <Subheader>{title}</Subheader>}
    <ul>
      {todos.map(todo => (
        <Todo key={todo.id} updateTodo={updateTodo} todo={todo} />
      ))}
    </ul>
  </div>
)

const Todo = ({ todo }) => {
  let [completed, setCompleted] = useState(todo.completed)
  const [updateCompletionStatus] = useMutation(UPDATE_TODO, {
    update (cache, { data: { updateTodo } }) {
      cache.modify({
        id: cache.identify({ id: todo.todoListId, __typename: 'TodoList' }),
        fields: {
          completedTodos (value) {
            if (updateTodo && updateTodo.completed && !updateTodo.deleted) {
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
  const [deleteTodo] = useMutation(UPDATE_TODO, {
    update (cache) {
      cache.modify({
        id: cache.identify({ id: todo.todoListId, __typename: 'TodoList' }),
        fields: {
          totalTodos (value) {
            value--
            return value
          }
        }
      })
    }
  })
  let handleChange = () => {
    setCompleted(!completed)
    let updatedTodo = { ...todo, completed: !completed }
    updateCompletionStatus({
      variables: {
        todo: updatedTodo
      },
      optimisticResponse: updatedTodo
    })
  }
  return (
    <Card className='mb-4' key={todo.id}>
      <div className='flex'>
        <div>
          <label>
            <input
              type='checkbox'
              checked={completed}
              onChange={handleChange}
              className='mr-3 cursor-pointer form-checkbox h-5 w-5 border hover:form-checkbox border-gray-300 rounded-md checked:color-green-500 checked:bg-blue-600 checked:border-transparent focus:outline-none'
            />
          </label>
        </div>
        <div className='flex-grow'>
          <div className='flex justify-between'>
            <div className='pr-4'>
              <span
                className={`${
                  completed ? 'line-through' : ''
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

      <div className='mt-2'>
        <div className='align-bottom justify-between flex-grow flex'>
          <Link href={`/edit-todo/${encodeURIComponent(todo.id)}`}>
            <a>
              <div className='cursor-pointer text-blue-500 hover:text-blue-800 mr-2 h-5 w-5'>
                <Edit />
              </div>
            </a>
          </Link>
          <div
            className='mr-2 h-5 w-5 text-blue-500 hover:text-blue-800 cursor-pointer'
            onClick={() => {
              let updatedTodo = {
                ...todo,
                deleted: !todo.deleted
              }
              let mutation = deleteTodo({
                variables: {
                  todo: updatedTodo
                },
                optimisticResponse: updatedTodo
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

export default TodoList
