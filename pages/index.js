import { useQuery } from '@apollo/client'
import { useState } from 'react'
import {
  MainContainer as Container,
  Loading,
  TodoLists,
  Button,
  AddTodoListModal,
  SearchPanel
} from '../components/index'
import { TodoLists as TODO_LISTS_QUERY } from '../queries/index'
import withApollo from '../lib/withApollo'
import Modal from 'react-modal'

const TodoFetcher = () => {
  const { loading: listLoading, error: listError, data: listData } = useQuery(
    TODO_LISTS_QUERY
  )
  if (listLoading || !listData) return <Loading />
  if (listError) return 'Error'
  return <TodoPage todoLists={listData.todoLists} />
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
          closeTimeoutMS={500}
        >
          <AddTodoListModal closeModal={closeModal} />
        </Modal>
      </div>
    </Container>
  )
}

const Apollo = withApollo({ ssr: true })(TodoFetcher)
export default Apollo
