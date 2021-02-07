import { useQuery } from '@apollo/client'
import { useState } from 'react'
import {
  MainContainer as Container,
  Loading,
  TodoLists,
  Button,
  AddTodoListModal
} from '../components/index'
import { TodoLists as TODO_LISTS_QUERY } from '../queries/index'
import withApollo from '../lib/withApollo'
import Modal from 'react-modal'

const TodoFetcher = () => {
  const { loading, error, data } = useQuery(TODO_LISTS_QUERY, {
    fetchPolicy: 'cache-first'
  })
  if (loading || !data) return <Loading />
  if (error) return 'Error'
  return <TodoPage todoLists={data.todoLists} />
}

const TodoPage = ({ todoLists }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const openModal = () => {
    setModalIsOpen(true)
  }

  const closeModal = () => {
    setModalIsOpen(false)
  }
  return (
    <Container>
      <TodoLists todoLists={todoLists} />
      <div className='fixed bottom-3 right-3 mt-3 flex justify-end'>
        <Button onClick={openModal}>Add</Button>
        <Modal
          className='bg-white outline-none inset-x-0 bottom-0 m-auto absolute w-full rounded-t-lg lg:w-2/5 border-2 px-2'
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel='Example Modal'
        >
          <AddTodoListModal closeModal={closeModal} />
        </Modal>
      </div>
    </Container>
  )
}

const Apollo = withApollo({ ssr: true })(TodoFetcher)
export default Apollo
