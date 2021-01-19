import { useMutation, useQuery } from '@apollo/client'
import { Formik } from 'formik'
import { string, object } from 'yup'
import toast from 'react-hot-toast'
import {
  TodolistForm,
  Loading,
  MainContainer as Container,
  Back,
  Card,
  Subheader
} from '../../components/index'
import {
  TodoList as TODO_LIST_QUERY,
  UpdateTodoList as UPDATE_TODOLIST
} from '../../queries/index'
import withApollo from '../../lib/withApollo'

const TodoFetcher = props => {
  const { loading, error, data } = useQuery(TODO_LIST_QUERY, {
    fetchPolicy: 'cache-first',
    variables: { id: props.id }
  })
  if (loading || !data) return <Loading />
  if (error) return 'Error'
  return <EditTodoListPage todoList={data.todoList} />
}

const EditTodoListPage = ({ todoList }) => {
  return (
    <Container>
      <Back title={todoList.name} />
      <Card>
        <Subheader>Edit todo list</Subheader>
        <EditTextInput todoList={todoList} />
      </Card>
    </Container>
  )
}

const EditTextInput = ({ todoList }) => {
  const [updateTodoList] = useMutation(UPDATE_TODOLIST)
  return (
    <Formik
      initialValues={{
        name: todoList.name
      }}
      validateOnChange={false}
      validationSchema={object().shape({
        name: string().required('Please provide name')
      })}
      onSubmit={(values, { setErrors }) => {
        setErrors({
          name: false
        })
        let { name } = values
        let updatedTodoList = {
          ...todoList,
          name
        }
        let mutation = updateTodoList({
          variables: {
            todoList: updatedTodoList
          },
          optimisticResponse: updatedTodoList
        })
        toast.promise(mutation, {
          loading: 'Loading',
          success: data => `Successfully edited todo list`,
          error: err => `This just happened: ${err.toString()}`
        })
      }}
    >
      {props => {
        return <TodolistForm {...props} />
      }}
    </Formik>
  )
}

const Apollo = withApollo({ ssr: true })(TodoFetcher)

Apollo.getInitialProps = async ({ query }) => {
  return { id: query.id }
}

export default Apollo
