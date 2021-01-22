import Link from 'next/link'
import { useMutation } from '@apollo/client'
import { Header, Button, CardListItem as Card } from './index'
import { UpdateTodoList as UPDATE_TODOLIST } from '../queries/index'
import toast from 'react-hot-toast'
import { Dustbin, Edit, ArrowRight } from './icons'

const TodoLists = ({ todoLists }) => {
  const [updateTodoList] = useMutation(UPDATE_TODOLIST)
  return (
    <div>
      <Header>Lists</Header>
      <ul className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        {todoLists.map(todoList => (
          <TodoList
            updateTodoList={updateTodoList}
            key={todoList.id}
            todoList={todoList}
          />
        ))}
      </ul>
      <div className='mt-3 flex justify-end'>
        <Button>
          <Link href={`/add-todolist`}>
            <a className='cursor-pointer font-bold'>Add</a>
          </Link>
        </Button>
      </div>
    </div>
  )
}

const TodoList = ({ todoList, updateTodoList }) => (
  <React.Fragment>
    {!todoList.deleted && (
      <Card key={todoList.id}>
        <div className='flex'>
          <div className='flex-grow'>
            <div className='flex justify-between'>
              <Link href={`/todos/${encodeURIComponent(todoList.id)}`}>
                <span className='cursor-pointer flex font-bold text-gray-900 text-xl'>
                  {todoList.name}
                </span>
              </Link>
              <div>
                <div className='text-xl text-right font-bold'>{`${
                  todoList.completedTodosVolume
                } / ${todoList.activeTodosVolume +
                  todoList.completedTodosVolume} `}</div>
                <div className='text-sm text-right'>Completed / Total </div>
              </div>
            </div>
            <div className='mt-3 mb-1'>
              <div className='align-bottom justify-between flex-grow flex'>
                <Link
                  href={`/edit-todolist/${encodeURIComponent(todoList.id)}`}
                >
                  <a>
                    <div className='cursor-pointer text-blue-500 hover:text-black mr-2 h-5 w-5'>
                      <Edit />
                    </div>
                  </a>
                </Link>
                <div
                  className='mr-2 h-5 w-5 text-blue-500 hover:text-black cursor-pointer'
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
                        <div className='font-semibold hover:text-black text-blue-500 h-5 w-5'>
                          <ArrowRight />
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

export default TodoLists
