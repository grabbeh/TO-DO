import { useQuery, useMutation } from '@apollo/client'
import { Formik, Form } from 'formik'
import { string, object } from 'yup'
import { Container, Input } from '../components/index'
import TODO_LISTS_QUERY from '../queries/TodoListsQuery'
import ADD_TODOLIST from '../queries/AddTodoListMutation'
import UPDATE_TODOLIST from '../queries/UpdateToDoListMutation'
import withApollo from '../lib/withApollo'
import gql from 'graphql-tag'
import { v4 as uuidv4 } from 'uuid'
import Link from 'next/link'

const TodoListsFetcher = () => {
  //https://github.com/apollographql/apollo-client/issues/7485
  const { loading, error, data } = useQuery(TODO_LISTS_QUERY)
  if (loading) return 'Loading'
  if (error) return 'Error'
  return <TodoListPage todoLists={data.todoLists} />
}

const TodoListPage = ({ todoLists }) => {
  // Simple mutation to rely on automatic cache updating based on ID for single entities (hopefully)
  const [updateTodoList] = useMutation(UPDATE_TODOLIST)

  return (
    <Container>
      <h1 className='mb-3 font-bold text-4xl'>To-dos</h1>
      <ul>
        {todoLists.map(todoList => (
          <TodoList
            key={todoList.id}
            updateTodoList={updateTodoList}
            todoList={todoList}
          />
        ))}
        <li>
          <TextInput />
        </li>
      </ul>
    </Container>
  )
}

const TodoList = props => {
  let { todoList, updateTodo } = props

  return (
    <li key={todoList.id}>
      {!todoList.deleted && (
        <div className='pb-2 flex content-center'>
          <Link href={`/?id=${todoList.id}`}>
            <a>Go to list</a>
          </Link>
          <div className='flex flex-grow'>
            <EditTextInput updateTodo={updateTodo} todoList={todoList} />
          </div>
          <div className='flex'>
            <div
              className='h-6 w-6 text-gray-500 hover:text-black cursor-pointer'
              onClick={() => {
                let updatedTodoList = {
                  ...todoList,
                  deleted: true
                }
                updateTodo({
                  variables: {
                    todoList: updatedTodoList
                  },
                  optimisticResponse: updatedTodoList
                })
              }}
            >
              <Dustbin />
            </div>
          </div>
        </div>
      )}
    </li>
  )
}

const EditTextInput = ({ updateTodoList, todoList }) => (
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
      updateTodoList({
        variables: {
          todoList: updatedTodoList
        },
        optimisticResponse: updatedTodoList
      })
    }}
  >
    {props => {
      const { values, errors, handleChange } = props
      return (
        <Form>
          <Input
            style={{ boxSizing: 'border-box' }}
            onChange={handleChange}
            name='name'
            value={values.name}
          />
          <div className='mt-1'>
            {
              <div>
                <div>{errors.name || errors.serverError}</div>
              </div>
            }
          </div>
        </Form>
      )
    }}
  </Formik>
)

const TextInput = () => {
  const [addTodoList] = useMutation(ADD_TODOLIST, {
    update (cache, { data: { addTodoList } }) {
      cache.modify({
        fields: {
          todoLists (existingTodoLists = []) {
            const newTodoListRef = cache.writeFragment({
              data: addTodoList,
              fragment: gql`
                fragment NewTodoList on TodoList {
                  id
                  name
                  deleted
                  user
                }
              `
            })
            return [...existingTodoLists, newTodoListRef]
          }
        }
      })
    }
  })

  return (
    <Formik
      initialValues={{
        name: ''
      }}
      validateOnChange={false}
      validationSchema={object().shape({
        name: string().required('Please provide name')
      })}
      onSubmit={(values, { setErrors, resetForm }) => {
        setErrors({
          name: false
        })
        let { name } = values
        console.log(name)
        const id = uuidv4()
        //mutation example + optimistic response
        addTodoList({
          variables: {
            todoList: { user: 'mbg@outlook.com', name, id }
          },
          optimisticResponse: {
            __typename: 'Mutation',
            addTodoList: {
              __typename: 'TodoList',
              name,
              id,
              deleted: false,
              user: 'mbg@outlook.com'
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
        return (
          <Form>
            <Input
              style={{ boxSizing: 'border-box' }}
              onChange={handleChange}
              name='name'
              value={values.name}
            />
            <div className='mt-1'>
              {
                <div>
                  <div>{errors.name || errors.serverError}</div>
                </div>
              }
            </div>
          </Form>
        )
      }}
    </Formik>
  )
}

const Dustbin = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 20 20'
    fill='currentColor'
  >
    <path
      fillRule='evenodd'
      d='M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z'
      clipRule='evenodd'
    />
  </svg>
)

const Edit = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 20 20'
    fill='currentColor'
  >
    <path d='M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z' />
  </svg>
)

export default withApollo({ ssr: true })(TodoListsFetcher)
