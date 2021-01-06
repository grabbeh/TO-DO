import Link from 'next/link'
import { useMutation } from '@apollo/client'
import { Header, Button } from '../components/index'
import { UpdateTodoList as UPDATE_TODOLIST } from '../queries/index'

const TodoLists = ({ todoLists }) => {
  // Simple mutation to rely on automatic cache updating based on ID for single entities (hopefully)
  const [updateTodoList] = useMutation(UPDATE_TODOLIST)
  return (
    <div>
      <Header>Lists</Header>
      <ul>
        {todoLists.map(todoList => (
          <TodoList
            updateTodoList={updateTodoList}
            key={todoList.id}
            todoList={todoList}
          />
        ))}
      </ul>
      <div className='mt-2 flex justify-end'>
        <Button>
          <Link href={`/add-todolist`}>
            <a className='mt-4 cursor-pointer font-bold'>Add</a>
          </Link>
        </Button>
      </div>
    </div>
  )
}

const TodoList = props => {
  let { todoList, updateTodoList } = props
  return (
    <li className='border-b-2 py-2 border-gray-500' key={todoList.id}>
      {!todoList.deleted && (
        <div className='flex content-center'>
          <div className='flex flex-grow'>
            <Link href={`/todos/${encodeURIComponent(todoList.id)}`}>
              <a className='font-medium text-xl'>{todoList.name}</a>
            </Link>
          </div>
          <div className='flex'>
            <Link href={`/edit-todolist/${encodeURIComponent(todoList.id)}`}>
              <a className='mt-4 cursor-pointer font-bold'>
                <div className='h-6 w-6 text-gray-500 hover:text-black cursor-pointer'>
                  <Edit />
                </div>
              </a>
            </Link>

            <div
              className='h-6 w-6 text-gray-500 hover:text-black cursor-pointer'
              onClick={() => {
                let updatedTodoList = {
                  ...todoList,
                  deleted: true
                }
                updateTodoList({
                  variables: {
                    todoList: updatedTodoList
                  },
                  optimisticResponse: updatedTodoList
                })
              }}
            >
              <Dustbin />
            </div>
          </div>
        </div>
      )}
    </li>
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

export default TodoLists
