import { useQuery, useMutation } from '@apollo/client'
import { Formik, Field, Form } from 'formik'
import { string, object } from 'yup'
import {
  MainContainer as Container,
  Input,
  Header,
  Back,
  Button
} from '../../components/index'
import {
  Todo as TODO_QUERY,
  UpdateTodo as UPDATE_TODO
} from '../../queries/index'
import withApollo from '../../lib/withApollo'
import gql from 'graphql-tag'
import { v4 as uuidv4 } from 'uuid'
import Loading from '../../components/loading'

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
      <div>
        <Back title={todo.text} />
        <Header>Edit todo</Header>
        <ul>
          <li>
            <TextInput todo={todo} />
          </li>
        </ul>
      </div>
    </Container>
  )
}

const TextInput = ({ todo }) => {
  console.log(todo)
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
        updateTodo({
          variables: {
            todo: updatedTodo
          },
          optimisticResponse: updatedTodo
        })
      }}
    >
      {props => {
        const { values, errors, handleChange } = props
        return (
          <Form className='w-full'>
            <Input
              textSize='text-xl focus:border-blue-500 border-gray-300 border-2 p-2 rounded'
              style={{ boxSizing: 'border-box' }}
              onChange={handleChange}
              name='text'
              label='Text'
              placeholder='Text'
              value={values.text}
            />
            <Input
              textSize='text-xl focus:border-blue-500 border-gray-300 border-2 p-2 rounded'
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
                  checked={values.priority === 'low'}
                  type='radio'
                  name='priority'
                  onChange={handleChange}
                  value='low'
                />
                <span className='font-bold text-md ml-2'>Low</span>
              </label>
              <label className='inline-flex items-center ml-3'>
                <input
                  checked={values.priority === 'medium'}
                  type='radio'
                  name='priority'
                  onChange={handleChange}
                  value='medium'
                />
                <span className='font-bold text-md ml-2'>Medium</span>
              </label>
              <label className='inline-flex items-center ml-3'>
                <input
                  checked={values.priority === 'high'}
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
