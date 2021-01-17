import { useState } from 'react'
import { Card } from './index'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { Dustbin, Comments, Edit, Rewind } from './icons/index'

const TodoList = ({ todos, title, updateTodo }) => (
  <div>
    {title && <div className='font-bold my-3 text-xl'>{title}</div>}
    <ul>
      {todos.map(todo => (
        <Todo key={todo.id} updateTodo={updateTodo} todo={todo} />
      ))}
    </ul>
  </div>
)

const Todo = ({ todo, updateTodo }) => {
  let [completed, setCompleted] = useState(todo.completed)
  let handleChange = () => {
    setCompleted(!completed)
    updateTodo({
      variables: {
        todo: { ...todo, completed: !completed }
      }
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
              <div className='flex justify-end text-base font-semibold text-gray-500'>
                {todo.createdSince}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='mt-2 mb-1 '>
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
              let mutation = updateTodo({
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
    <div className={`${textColor} font-bold py-1 px-2 bg-white rounded`}>
      {priority.toUpperCase()}
    </div>
  )
}

export default TodoList
