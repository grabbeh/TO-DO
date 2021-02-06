import { useQuery, useMutation } from '@apollo/client'
import { Formik } from 'formik'
import { string, object } from 'yup'
import toast from 'react-hot-toast'
import {
  MainContainer as Container,
  Back,
  Subheader,
  TodoForm,
  Loading,
  Card,
  TodoList
} from '../components/index'
import { Todos as TODOS_QUERY, AddTodo as ADD_TODO } from '../queries/index'
import withApollo from '../lib/withApollo'
import gql from 'graphql-tag'
import { v4 as uuidv4 } from 'uuid'

const TodoFetcher = () => {
  const { loading, error, data } = useQuery(TODOS_QUERY, {
    variables: { id: '4bc0f474-5ece-43cc-92e7-da4ec4507fe6' }
  })
  if (loading || !data) return <Loading />
  if (error) return 'Error'
  return <AddTodoPage id='4bc0f474-5ece-43cc-92e7-da4ec4507fe6' data={data} />
}

const AddTodoPage = ({ id, data }) => {
  let { todoList } = data
  return (
    <Container>
      <TodoList todos={todoList.activeTodos} />
      <AddTodoInput name={todoList.name} parentId={id} />
    </Container>
  )
}

const AddTodoInput = ({ name, parentId }) => (
  <div>
    <Back title={name} />
    <Card>
      <Subheader>Add todo</Subheader>
      <TextInput parentId={parentId} />
    </Card>
  </div>
)

const TextInput = ({ parentId }) => {
  const [addTodo] = useMutation(ADD_TODO, {
    update (cache, { data }) {
      console.log(data)
      cache.modify({
        id: cache.identify({ id: parentId, __typename: 'TodoList' }),
        fields: {
          activeTodosVolume (value) {
            return value + 1
          },
          activeTodos (existingTodos = []) {
            const newTodoRef = cache.writeFragment({
              data: data.addTodo,
              fragment: gql`
                fragment NewTodo on Todo {
                  id
                  todoListId
                  text
                  completed
                  deleted
                  user
                  createdSince
                  commentsCount
                }
              `
            })
            return [...existingTodos, newTodoRef]
          }
        }
      })
    }
  })

  return (
    <Formik
      initialValues={{
        text: '',
        priority: '',
        contact: ''
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
        const id = uuidv4()
        let todo = {
          __typename: 'Todo',
          user: 'mbg@outlook.com',
          text,
          contact,
          priority,
          completed: false,
          deleted: false,
          id,
          todoListId: parentId
        }
        let mutation = addTodo({
          variables: { todo },
          optimisticResponse: {
            __typename: 'Mutation',
            addTodo: {
              ...todo,
              completed: false,
              deleted: false,
              commentsCount: 0,
              createdSince: 'Just now'
            }
          }
        })

        toast.promise(mutation, {
          loading: 'Loading',
          success: data => `Successfully saved todo`,
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
