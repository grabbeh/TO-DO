import { useQuery, useMutation, useLazyQuery } from '@apollo/client'
import _ from 'lodash'
import { useState } from 'react'
import {
  MainContainer as Container,
  Back,
  Button,
  Loading,
  TodoList,
  AddTodoModal
} from '../../components/index'
import Modal from 'react-modal'
import { Dustbin } from '../../components/icons'
import {
  UpdateTodo as UPDATE_TODO,
  Todos as TODOS_QUERY,
  CompletedTodos as COMPLETED_TODOS
} from '../../queries/index'
import withApollo from '../../lib/withApollo'
import Link from 'next/link'

const TodoFetcher = ({ id }) => {
  const { loading, error, data } = useQuery(TODOS_QUERY, {
    fetchPolicy: 'cache-first',
    variables: { id }
  })
  if (loading || !data) return <Loading />
  if (error) return 'Error'
  return <TodoPage id={id} todoList={data.todoList} />
}

const TodoPage = ({ todoList, id }) => {
  const [updateTodo] = useMutation(UPDATE_TODO)
  const [modalIsOpen, setIsOpen] = useState(false)
  const openModal = () => {
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
  }

  let {
    name,
    activeTodos,
    completedTodos,
    activeTodosVolume,
    completedTodosVolume
  } = todoList
  return (
    <Container>
      <div className='flex justify-between'>
        <Back title={name} />
        <div className='mt-3 pr-3 lg:pr-0 text-2xl font-bold'>
          {completedTodosVolume} / {activeTodosVolume + completedTodosVolume}
        </div>
      </div>
      <TodoList parentId={id} updateTodo={updateTodo} todos={activeTodos} />
      {completedTodos.length > 0 && (
        <TodoList
          title='Completed'
          parentId={id}
          updateTodo={updateTodo}
          todos={completedTodos}
        />
      )}
      <div className='pl-2 lg:pl-0 mt-2 flex justify-between'>
        <Link href={`/deleted/${encodeURIComponent(id)}`}>
          <a>
            <div className='h-8 w-8'>
              <Dustbin />
            </div>
          </a>
        </Link>
        <div className='fixed right-3 bottom-3'>
          <Button onClick={openModal}>Add</Button>
        </div>
        <Modal
          className='bg-white outline-none inset-x-0 bottom-0 m-auto absolute w-full rounded-t-lg lg:w-2/5 border-2 px-2'
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel='Example Modal'
        >
          <AddTodoModal closeModal={closeModal} id={id} name={name} />
        </Modal>
      </div>
    </Container>
  )
}

const Apollo = withApollo({ ssr: true })(TodoFetcher)

Apollo.getInitialProps = async ({ query }) => {
  return { id: query.id }
}

export default Apollo
