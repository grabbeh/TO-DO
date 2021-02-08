import Link from 'next/link'
import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { Header, CardListItem as Card, EditTodoListModal } from './index'
import { UpdateTodoList as UPDATE_TODOLIST } from '../queries/index'
import toast from 'react-hot-toast'
import { Dustbin, Edit, ArrowRight } from './icons'
import Modal from 'react-modal'

const TodoLists = ({ todoLists }) => {
  const [updateTodoList] = useMutation(UPDATE_TODOLIST)
  return (
    <div>
      <Header>Lists</Header>
      <ul className='border-t-2 border-l-2 border-r-2'>
        {todoLists.map(todoList => (
          <TodoList
            updateTodoList={updateTodoList}
            key={todoList.id}
            todoList={todoList}
          />
        ))}
      </ul>
    </div>
  )
}

const TodoList = ({ todoList, updateTodoList }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const openModal = () => {
    setModalIsOpen(true)
  }

  const closeModal = () => {
    setModalIsOpen(false)
  }
  return (
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
              <div className='mt-2 mb-1'>
                <div className='align-bottom justify-between flex-grow flex'>
                  <div
                    onClick={openModal}
                    className='cursor-pointer text-blue-500 hover:text-black mr-2 h-5 w-5'
                  >
                    <Edit />
                  </div>
                  <Modal
                    className='bg-white outline-none inset-x-0 bottom-0 m-auto absolute w-full rounded-t-lg lg:w-2/5 border-2 px-2'
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    contentLabel='Example Modal'
                    closeTimeoutMS={500}
                  >
                    <EditTodoListModal
                      todoList={todoList}
                      closeModal={closeModal}
                    />
                  </Modal>
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
                        }
                      })
                      toast.promise(mutation, {
                        loading: 'Loading',
                        success: data => `Todo list deleted`,
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
}

export default TodoLists
