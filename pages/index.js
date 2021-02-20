import { useQuery, useMutation } from '@apollo/client'
import { useState } from 'react'
import {
  Loading,
  TodoLists,
  Button,
  AddTodoListModal,
  TodoList
} from '../components/index'
import {
  TodoLists as TODO_LISTS_QUERY,
  AllTodos as ALLTODOS_QUERY,
  UpdateTodo as UPDATE_TODO
} from '../queries/index'
import withApollo from '../lib/withApollo'
import Modal from 'react-modal'

const TodoFetcher = () => {
  const { loading: listLoading, error: listError, data: listData } = useQuery(
    TODO_LISTS_QUERY
  )
  const {
    loading: todosLoading,
    error: todosError,
    data: todosData
  } = useQuery(ALLTODOS_QUERY, {
    fetchPolicy: 'cache-first',
    variables: { olderThan: 1 }
  })
  if (listLoading || !listData || todosLoading || !todosData) return <Loading />
  if (listError || todosError) return 'Error'
  return <TodoPage todos={todosData.allTodos} todoLists={listData.todoLists} />
}

const TodoPage = ({ todoLists, todos }) => {
  const [updateTodo] = useMutation(UPDATE_TODO)
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const openModal = () => {
    setModalIsOpen(true)
  }

  const closeModal = () => {
    setModalIsOpen(false)
  }
  return (
    <div className='bg-gray-100 flex flex-wrap'>
      <TodoLists todoLists={todoLists} />
      <div className='flex justify-center m-auto'>
        <TodoList title='Oldest 5' updateTodo={updateTodo} todos={todos} />
      </div>
      <div className='fixed bottom-3 right-3 mt-3 flex justify-end'>
        <Button onClick={openModal}>Add</Button>
        <Modal
          className='bg-white outline-none inset-x-0 bottom-0 m-auto absolute w-full rounded-t-lg lg:w-2/5 border-2 px-2'
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel='Example Modal'
          closeTimeoutMS={500}
        >
          <AddTodoListModal closeModal={closeModal} />
        </Modal>
      </div>
    </div>
  )
}

const Apollo = withApollo({ ssr: true })(TodoFetcher)
export default Apollo
