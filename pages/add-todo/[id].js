import { useQuery, useMutation } from '@apollo/client'
import { Formik } from 'formik'
import { useRouter } from 'next/router'
import { string, object } from 'yup'
import {
  MainContainer as Container,
  Back,
  Subheader,
  TodoForm,
  Loading
} from '../../components/index'
import { Todos as TODOS_QUERY, AddTodo as ADD_TODO } from '../../queries/index'
import withApollo from '../../lib/withApollo'
import gql from 'graphql-tag'
import { v4 as uuidv4 } from 'uuid'
import capitalise from '../../utils/capitalise'

const priorities = ['low', 'medium', 'high']

const TodoFetcher = props => {
  const { loading, error, data } = useQuery(TODOS_QUERY, {
    fetchPolicy: 'cache-first',
    variables: { id: props.id }
  })
  if (loading || !data) return <Loading />
  if (error) return 'Error'
  return <AddTodoPage id={props.id} data={data} />
}

const AddTodoPage = ({ id, data }) => {
  let {
    todoList: { name }
  } = data
  return (
    <Container>
      <AddTodoInput name={name} parentId={id} />
    </Container>
  )
}

const AddTodoInput = ({ name, parentId }) => (
  <div>
    <Back title={name} />
    <Subheader>Add todo</Subheader>
    <ul>
      <li>
        <TextInput parentId={parentId} />
      </li>
    </ul>
  </div>
)

const TextInput = ({ parentId }) => {
  const router = useRouter()

  const [addTodo] = useMutation(ADD_TODO, {
    update (cache, { data: { addTodo } }) {
      cache.modify({
        fields: {
          todoList (existingTodoList = []) {
            const newTodoRef = cache.writeFragment({
              data: addTodo,
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

            return {
              ...existingTodoList,
              todos: [...existingTodoList.todos, newTodoRef]
            }
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
        // get parent ID from URL
        //mutation example + optimistic response
        addTodo({
          variables: {
            todo: {
              user: 'mbg@outlook.com',
              text,
              contact,
              priority,
              completed: false,
              deleted: false,
              id,
              todoListId: parentId
            }
          },
          optimisticResponse: {
            __typename: 'Mutation',
            addTodo: {
              __typename: 'Todo',
              text,
              contact,
              priority,
              id,
              todoListId: parentId,
              deleted: false,
              completed: false,
              user: 'mbg@outlook.com',
              createdSince: 0,
              commentsCount: 0
            }
          }
          // for a new item, optimisticResponse needs typename and the id of the
          // item that will be returned - so id creation has to happen client-side
        })
        resetForm()
        router.back()
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
