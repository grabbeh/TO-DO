import { useQuery, useMutation } from '@apollo/client'
import { Formik } from 'formik'
import { string, object } from 'yup'
import {
  MainContainer as Container,
  Back,
  Subheader,
  Loading,
  TodoForm
} from '../../components/index'
import toast from 'react-hot-toast'
import {
  Todo as TODO_QUERY,
  UpdateTodo as UPDATE_TODO
} from '../../queries/index'
import withApollo from '../../lib/withApollo'

const TodoFetcher = props => {
  const { loading, error, data } = useQuery(TODO_QUERY, {
    fetchPolicy: 'cache-first',
    variables: { id: props.id }
  })
  if (loading || !data) return <Loading />
  if (error) return 'Error'
  return <EditTodoPage data={data} />
}

const EditTodoPage = ({ data: { todo } }) => {
  return (
    <Container>
      <Back title={todo.text} />
      <Subheader>Edit todo</Subheader>
      <TextInput todo={todo} />
    </Container>
  )
}

const TextInput = ({ todo }) => {
  let { contact, text, priority } = todo
  const [updateTodo] = useMutation(UPDATE_TODO)

  return (
    <Formik
      initialValues={{
        text,
        priority,
        contact
      }}
      validateOnChange={false}
      validationSchema={object().shape({
        text: string().required('Please provide text')
      })}
      onSubmit={(values, { setErrors, resetForm }) => {
        setErrors({
          text: false,
          contact: false,
          priority: false
        })
        let { text, contact, priority } = values
        let updatedTodo = {
          ...todo,
          text,
          contact,
          priority
        }
        let mutation = updateTodo({
          variables: {
            todo: updatedTodo
          },
          optimisticResponse: updatedTodo
        })

        toast.promise(mutation, {
          loading: 'Loading',
          success: data => `Successfully edited todo`,
          error: err => `This just happened: ${err.toString()}`
        })
      }}
    >
      {props => {
        return <TodoForm {...props} />
      }}
    </Formik>
  )
}

const Apollo = withApollo({ ssr: true })(TodoFetcher)

Apollo.getInitialProps = async ({ query }) => {
  return { id: query.id }
}

export default Apollo
