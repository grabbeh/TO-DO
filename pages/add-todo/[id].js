import { useQuery, useMutation } from '@apollo/client'
import { Formik, Form } from 'formik'
import { string, object } from 'yup'
import {
  MainContainer as Container,
  Input,
  Header,
  Back,
  Subheader,
  Button
} from '../../components/index'
import { Todos as TODOS_QUERY, AddTodo as ADD_TODO } from '../../queries/index'
import withApollo from '../../lib/withApollo'
import gql from 'graphql-tag'
import { v4 as uuidv4 } from 'uuid'
import Loading from '../../components/loading'

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

const TextInput = ({ parentId, position = 0 }) => {
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
                  position
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
              position,
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
      }}
    >
      {props => {
        const { values, errors, handleChange } = props
        console.log(values)
        return (
          <Form className='w-full'>
            <Input
              style={{ boxSizing: 'border-box' }}
              onChange={handleChange}
              name='text'
              label='Text'
              placeholder='Text'
              value={values.text}
            />
            <Input
              style={{ boxSizing: 'border-box' }}
              onChange={handleChange}
              label='Contact'
              name='contact'
              placeholder='Contact'
              value={values.contact}
            />
            <div className='text-md font-bold'>Priority</div>
            <div role='group'>
              <label className='inline-flex items-center'>
                <input
                  type='radio'
                  name='priority'
                  onChange={handleChange}
                  value='low'
                />
                <span className='font-bold text-md ml-2'>Low</span>
              </label>
              <label className='inline-flex items-center ml-3'>
                <input
                  type='radio'
                  name='priority'
                  onChange={handleChange}
                  value='medium'
                />
                <span className='font-bold text-md ml-2'>Medium</span>
              </label>
              <label className='inline-flex items-center ml-3'>
                <input
                  type='radio'
                  name='priority'
                  onChange={handleChange}
                  value='high'
                />
                <span className='font-bold text-md ml-2'>High</span>
              </label>
            </div>
            <div className='mt-3 flex justify-end'>
              <Button>Add</Button>
            </div>

            <div className='mt-1'>
              {
                <div>
                  <div>{errors.text || errors.serverError}</div>
                </div>
              }
            </div>
          </Form>
        )
      }}
    </Formik>
  )
}

const Apollo = withApollo({ ssr: true })(TodoFetcher)

Apollo.getInitialProps = async ({ query }) => {
  return { id: query.id }
}

export default Apollo
