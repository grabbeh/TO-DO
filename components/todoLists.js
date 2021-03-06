import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import Modal from 'react-modal'
import { activeSideBarVar } from '../lib/withApollo'
import Link from 'next/link'
import {
  Button,
  TodoListOptionsBox,
  AddTodoListModal,
  AddTodoModal,
  Loading
} from './index'
import { Cross, Plus } from './icons/index'
import {
  TodoLists as TODO_LISTS_QUERY,
  ActiveCategory as ACTIVE_CATEGORY,
  ActiveSideBar as ACTIVE_SIDEBAR
} from '../queries/index'

const TodoLists = () => {
  const router = useRouter()
  let existingUrl = router.asPath
  const { loading, data } = useQuery(TODO_LISTS_QUERY)
  const {
    data: { activeCategory }
  } = useQuery(ACTIVE_CATEGORY, { fetchPolicy: 'cache-only' })

  const {
    data: { activeSideBar }
  } = useQuery(ACTIVE_SIDEBAR, { fetchPolicy: 'cache-only' })

  const [modalIsOpen, setModalIsOpen] = useState(false)
  const openModal = () => {
    setModalIsOpen(true)
  }

  const closeModal = () => {
    setModalIsOpen(false)
  }

  if (loading || !data) return <Loading />
  return (
    <div
      className={`${
        activeSideBar ? 'inline-block' : 'hidden'
      }  mr-8 md:mr-0 w-full md:flex md:flex-col h-screen flex-none top-0`}
    >
      <div
        id='test'
        className=' flex-grow-0 px-2 border-b flex justify-between'
      >
        <h1 className='text-xl text-black font-semibold my-3'>Lists</h1>
        <div
          className='h-8 w-8 cursor-pointer  md:hidden'
          onClick={() => activeSideBarVar(false)}
        >
          <Cross />
        </div>
      </div>
      <div className='text-black h-full flex-grow overflow-y-hidden relative'>
        <div className='absolute inset-0 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-200 scrollbar-thumb-rounded'>
          <ul className='mr-2 pb-2'>
            <ListLink
              activeCategory={activeCategory}
              text='oldest'
              url={returnUrl(existingUrl, null, 'oldest')}
            />
            <ListLink
              activeCategory={activeCategory}
              text='newest'
              url={returnUrl(existingUrl, null, 'newest')}
            />
            <ListLink
              activeCategory={activeCategory}
              text='pinned'
              url={returnUrl(existingUrl, null, 'pinned')}
            />
            {data.todoLists.map(todoList => (
              <TodoList
                key={todoList.id}
                activeCategory={activeCategory}
                todoList={todoList}
              />
            ))}
          </ul>
          <div className='my-3 ml-2'>
            <Button
              onClick={() => {
                openModal()
              }}
            >
              New todolist
            </Button>
            <Modal
              className='bg-white outline-none relative rounded-t-lg border-2 px-2'
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

const ListLink = ({ url, text, activeCategory }) => (
  <li
    className={`${activeCategory === text && 'bg-yellow-300'}
   py-1 pl-1 hover:bg-yellow-300 cursor-pointer overflow-hidden whitespace-nowrap overflow-ellipsis text-md`}
  >
    <Link href={url}>
      <a>{text}</a>
    </Link>
  </li>
)

const returnUrl = (existing, todoListId, category) => {
  let newUrl
  if (existing.indexOf('comments') == -1) {
    if (!category) {
      newUrl = `/todos/${todoListId}`
    } else newUrl = `/category/${category}`
  } else {
    let commentPath = comments(existing)
    if (!category) {
      newUrl = `/todos/${todoListId}/${commentPath}`
    } else {
      newUrl = `/category/${category}/${commentPath}`
    }
  }
  return newUrl
}

const comments = url => {
  let index = url.indexOf('comments')
  let updated = url.slice(index)
  return updated
}

const TodoList = ({ todoList, activeCategory }) => {
  const router = useRouter()
  let existingUrl = router.asPath
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
        <li
          className={`${activeCategory === todoList.name &&
            'bg-yellow-300'} cursor-pointer py-1 px-1 hover:bg-yellow-300`}
          key={todoList.id}
        >
          <div className='flex justify-between'>
            <span
              onClick={() => {
                router.push(returnUrl(existingUrl, todoList.id))
              }}
              className='cursor-pointer overflow-hidden whitespace-nowrap overflow-ellipsis text-md '
            >
              # {todoList.name}
            </span>
            <div className='relative flex'>
              <div
                className='cursor-pointer mt-1 h-5 w-5'
                onClick={() => {
                  openModal()
                }}
              >
                <Plus />
              </div>
              <Modal
                closeTimeoutMS={500}
                className='bg-white outline-none inset-x-0 m-auto absolute w-full rounded-t-lg lg:w-2/5 border-2 px-2'
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
              <div className='px-2 text-md text-right'>
                {todoList.activeTodosVolume}
              </div>
              <div>
                <TodoListOptionsBox todoList={todoList} />
              </div>
            </div>
          </div>
        </li>
      )}
    </React.Fragment>
  )
}

export default TodoLists
