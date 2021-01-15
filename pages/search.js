import { useQuery, useMutation } from '@apollo/client'
import { useState } from 'react'
import {
  MainContainer as Container,
  Loading,
  Back,
  Card
} from '../components/index'
import {
  TodosByDate as TODOSBYDATE_QUERY,
  UpdateTodo as UPDATE_TODO
} from '../queries/index'
import Link from 'next/link'
import withApollo from '../lib/withApollo'

const TodoFetcher = () => {
  const { loading, error, data } = useQuery(TODOSBYDATE_QUERY, {
    fetchPolicy: 'cache-first'
  })
  if (loading || !data) return <Loading />
  if (error) return 'Error'
  console.log(data)
  return <TodoPage todosByDate={data.todosByDate} />
}

const TodoPage = ({ todosByDate }) => {
  const [updateTodo] = useMutation(UPDATE_TODO)
  return (
    <Container>
      <Back title='Back' />
      <TodoList updateTodo={updateTodo} todos={todosByDate} />
    </Container>
  )
}

const TodoList = ({ todos, updateTodo }) => (
  <div>
    <div className='font-bold text-xl'>New todos</div>
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
    <Card key={todo.id}>
      <div className='flex'>
        <div>
          <label>
            <input
              type='checkbox'
              checked={completed}
              onChange={handleChange}
              className='mr-3 cursor-pointer form-checkbox h-6 w-6 border hover:form-checkbox border-gray-300 rounded-md checked:color-green-500 checked:bg-blue-600 checked:border-transparent focus:outline-none'
            />
          </label>
        </div>
        <div className='flex-grow'>
          <div className='flex justify-between'>
            <div>
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

          <div className='border-t-2 py-1 mt-2 border-blue-500'>
            <div className='align-bottom justify-between flex-grow flex'>
              <Link href={`/edit-todo/${encodeURIComponent(todo.id)}`}>
                <a>
                  <div className='cursor-pointer text-blue-500 hover:text-black mr-2 h-4 w-4'>
                    <Edit />
                  </div>
                </a>
              </Link>
              <div
                className='mr-2 h-4 w-4 text-blue-500 hover:text-black cursor-pointer'
                onClick={() => {
                  let updatedTodo = {
                    ...todo,
                    deleted: true
                  }
                  let mutation = updateTodo({
                    variables: {
                      todo: updatedTodo
                    },
                    optimisticResponse: updatedTodo
                  })
                  toast.promise(mutation, {
                    loading: 'Loading',
                    success: data => `Successfully deleted todo`,
                    error: err => `This just happened: ${err.toString()}`
                  })
                }}
              >
                <Dustbin />
              </div>
              <div>
                <div className='cursor-pointer'>
                  <Link href={`/notes/${encodeURIComponent(todo.id)}`}>
                    <a>
                      <div className='flex hover:text-black text-blue-500'>
                        <div className='h-4 w-4'>
                          <CommentsIcon />
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
        </div>
      </div>
    </Card>
  )
}

const Dustbin = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 20 20'
    fill='currentColor'
  >
    <path
      fillRule='evenodd'
      d='M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z'
      clipRule='evenodd'
    />
  </svg>
)

const Edit = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 20 20'
    fill='currentColor'
  >
    <path d='M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z' />
  </svg>
)

const CommentsIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 20 20'
    fill='currentColor'
  >
    <path
      fillRule='evenodd'
      d='M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z'
      clipRule='evenodd'
    />
  </svg>
)

const Rating = ({ priority }) => {
  let bgColor = 'text-green-500'
  if (priority === 'medium') bgColor = 'text-yellow-500'
  if (priority === 'high') bgColor = 'text-red-500'
  return (
    <div className={`${bgColor} font-bold  rounded`}>
      {priority.toUpperCase()}
    </div>
  )
}

const Apollo = withApollo({ ssr: true })(TodoFetcher)
export default Apollo
