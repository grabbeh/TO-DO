import Link from 'next/link'
import { useMutation } from '@apollo/client'
import { Header, Button, Card } from '../components/index'
import { UpdateTodoList as UPDATE_TODOLIST } from '../queries/index'
import toast from 'react-hot-toast'

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

const TodoList = ({ todoList, updateTodoList }) => {
  return (
    <React.Fragment>
      {!todoList.deleted && (
        <Card key={todoList.id}>
          <div className='flex'>
            <div className='flex-grow'>
              <Link href={`/todos/${encodeURIComponent(todoList.id)}`}>
                <span className='cursor-pointer flex font-bold text-gray-900 text-xl'>
                  {todoList.name}
                </span>
              </Link>

              <div className='border-t-2 py-1 mt-2 border-blue-500'>
                <div className='align-bottom justify-between flex-grow flex'>
                  <Link
                    href={`/edit-todolist/${encodeURIComponent(todoList.id)}`}
                  >
                    <a>
                      <div className='cursor-pointer text-blue-500 hover:text-black mr-2 h-4 w-4'>
                        <Edit />
                      </div>
                    </a>
                  </Link>
                  <div
                    className='mr-2 h-4 w-4 text-blue-500 hover:text-black cursor-pointer'
                    onClick={() => {
                      let updatedTodoList = {
                        ...todoList,
                        deleted: true
                      }
                      let mutation = updateTodoList({
                        variables: {
                          todoList: updatedTodoList
                        },
                        optimisticResponse: updatedTodoList
                      })
                      toast.promise(mutation, {
                        loading: 'Loading',
                        success: data => `Successfully deleted todolist`,
                        error: err => `This just happened: ${err.toString()}`
                      })
                    }}
                  >
                    <Dustbin />
                  </div>
                  <div>
                    <div className='cursor-pointer'>
                      <Link href={`/todos/${encodeURIComponent(todoList.id)}`}>
                        <a>
                          <div className='font-semibold hover:text-black text-blue-500'>
                            Todos
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
      )}
    </React.Fragment>
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
