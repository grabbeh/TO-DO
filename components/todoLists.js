import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import { activeCategoryVar } from '../lib/withApollo'
import {
  Button,
  TodoListOptionsBox,
  AddTodoListModal,
  AddTodoModal,
  Loading
} from './index'
import { Cross } from './icons/index'
import {
  TodoLists as TODO_LISTS_QUERY,
  ActiveCategory as ACTIVE_CATEGORY
} from '../queries/index'
import { Plus } from './icons/index'
import Modal from 'react-modal'

const TodoLists = ({ getTodos, showSideBar, setShowSideBar }) => {
  const { loading, error, data } = useQuery(TODO_LISTS_QUERY)
  if (loading || !data) return <Loading />
  if (error) return 'Error'
  const {
    data: { activeCategory }
  } = useQuery(ACTIVE_CATEGORY)

  const [modalIsOpen, setModalIsOpen] = useState(false)
  const openModal = () => {
    setModalIsOpen(true)
  }

  const closeModal = () => {
    setModalIsOpen(false)
  }
  const router = useRouter()

  return (
    <div
      className={`${
        showSideBar ? 'inline-block' : 'hidden'
      }  mr-8 md:mr-0 w-full  md:flex md:flex-col h-screen flex-none top-0 bg-purple-900`}
    >
      <div className='bg-purple-900 flex-grow-0 px-2 border-b flex justify-between'>
        <h1 className='text-white text-xl my-3'>Lists</h1>
        <div
          className='h-8 w-8 cursor-pointer hover:text-white text-gray-200 md:hidden'
          onClick={() => setShowSideBar(false)}
        >
          <Cross />
        </div>
      </div>
      <div className='h-full flex-grow overflow-y-hidden relative'>
        <div className='absolute inset-0 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-300 scrollbar-thumb-rounded'>
          <ul className='px-2 pb-2'>
            <div
              className={`${activeCategory === 'Oldest' &&
                'font-bold'} cursor-pointer py-1 px-1 hover:bg-purple-800`}
              onClick={() => {
                getTodos({ variables: { oldest: true } })
                setShowSideBar(false)
                activeCategoryVar('Oldest')
                router.push(`/`, undefined, {
                  shallow: true
                })
              }}
            >
              <span
                className={`${activeCategory === 'Oldest' &&
                  'font-bold'} cursor-pointer flex text-md hover:text-white text-gray-200`}
              >
                Oldest
              </span>
            </div>
            <div
              className='cursor-pointer py-1 px-1 hover:bg-purple-800'
              onClick={() => {
                getTodos({ variables: { newest: true } })
                setShowSideBar(false)
                activeCategoryVar('Newest')
                router.push(`/`, undefined, {
                  shallow: true
                })
              }}
            >
              <span
                className={`${activeCategory === 'Newest' &&
                  'font-bold'} cursor-pointer flex text-md hover:text-white text-gray-200`}
              >
                Newest
              </span>
            </div>
            <div
              className='cursor-pointer py-1 px-1 hover:bg-purple-800'
              onClick={() => {
                getTodos({ variables: { pinned: true } })
                setShowSideBar(false)
                activeCategoryVar('Pinned')
                router.push(`/`, undefined, {
                  shallow: true
                })
              }}
            >
              <span
                className={`${activeCategory === 'Pinned' &&
                  'font-bold'} cursor-pointer flex  text-md hover:text-white text-gray-200`}
              >
                Pinned
              </span>
            </div>
            {data.todoLists.map(todoList => (
              <TodoList
                key={todoList.id}
                activeCategory={activeCategory}
                setShowSideBar={setShowSideBar}
                getTodos={getTodos}
                todoList={todoList}
              />
            ))}
          </ul>
          <div className='mt-3 ml-3'>
            <Button onClick={openModal}>New todolist</Button>
            <Modal
              className='bg-white outline-none bottom-0 left-0 absolute rounded-t-lg border-2 px-2'
              isOpen={modalIsOpen}
              onRequestClose={closeModal}
              contentLabel='Example Modal'
              closeTimeoutMS={500}
            >
              <AddTodoListModal closeModal={closeModal} />
            </Modal>
          </div>
        </div>
      </div>
    </div>
  )
}

const TodoList = ({ todoList, activeCategory, setShowSideBar, getTodos }) => {
  const router = useRouter()
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
        <div
          className='cursor-pointer py-1 px-1 hover:bg-purple-800'
          key={todoList.id}
        >
          <div className='flex justify-between'>
            <span
              onClick={() => {
                getTodos({ variables: { id: todoList.id } })
                setShowSideBar(false)
                activeCategoryVar(todoList.name)
                router.push(`/todos/${todoList.id}`, undefined, {
                  shallow: true
                })
              }}
              className={`${activeCategory === todoList.name && 'font-bold'}
                  cursor-pointer overflow-hidden whitespace-nowrap overflow-ellipsis text-md hover:text-white text-gray-200`}
            >
              # {todoList.name}
            </span>
            <div className='flex'>
              <div
                className='cursor-pointer mt-1 h-5 w-5 hover:text-white text-gray-300'
                onClick={openModal}
              >
                <Plus />
              </div>
              <Modal
                closeTimeoutMS={500}
                className='bg-white outline-none inset-x-0 bottom-0 m-auto absolute w-full rounded-t-lg lg:w-2/5 border-2 px-2'
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel='Example Modal'
              >
                <AddTodoModal
                  closeModal={closeModal}
                  id={todoList.id}
                  name={todoList.name}
                />
              </Modal>
              <div className='px-2 text-md text-right  hover:text-white text-gray-300'>
                {todoList.activeTodosVolume}
              </div>
              <div>
                <TodoListOptionsBox todoList={todoList} />
              </div>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  )
}

export default TodoLists
