import { useQuery, useMutation } from '@apollo/client'
import { useState } from 'react'
import { Formik, Form } from 'formik'
import { string, object } from 'yup'
import _ from 'lodash'
import {
  MainContainer as Container,
  Input,
  Header
} from '../../components/index'
import {
  AddTodo as ADD_TODO,
  UpdateTodo as UPDATE_TODO,
  Todos as TODOS_QUERY
} from '../../queries/index'
import withApollo from '../../lib/withApollo'
import gql from 'graphql-tag'
import { v4 as uuidv4 } from 'uuid'
import Loading from '../../components/loading'
import Link from 'next/link'

const TodoFetcher = props => {
  const { loading, error, data } = useQuery(TODOS_QUERY, {
    fetchPolicy: 'cache-first',
    variables: { id: props.id }
  })
  if (loading || !data) return <Loading />
  if (error) return 'Error'

  return <TodoPage id={props.id} data={data} />
}

const TodoPage = ({ data, id }) => {
  const [updateTodo] = useMutation(UPDATE_TODO)
  let {
    todoList: { name, todos }
  } = data
  todos = todos.filter(t => !t.deleted)
  let nonCompleted = todos.filter(t => !t.completed)
  let grouped = _.groupBy(nonCompleted, 'createdSince')
  let completed = todos.filter(t => t.completed)
  return (
    <Container>
      <Header>{name}</Header>
      {Object.entries(grouped).map(([key, value]) => (
        <TodoList
          key={key}
          parentId={id}
          title={key}
          updateTodo={updateTodo}
          todos={value}
        />
      ))}
      {completed.length > 0 && (
        <TodoList
          title='Completed'
          parentId={id}
          updateTodo={updateTodo}
          todos={completed}
        />
      )}
    </Container>
  )
}

const TodoList = ({ todos, title, parentId, updateTodo }) => (
  <div>
    {title && <div className='font-bold text-xl'>{title}</div>}
    <ul>
      {todos.map(todo => (
        <Todo key={todo.id} updateTodo={updateTodo} todo={todo} />
      ))}
      <li>
        <TextInput parentId={parentId} position={todos.length} />
      </li>
    </ul>
  </div>
)

const Todo = ({ todo, updateTodo }) => {
  let [completed, setCompleted] = useState(todo.completed)
  let handleChange = () => {
    setCompleted(!completed)
    updateTodo({
      variables: {
        todo: { ...todo, completed: !completed }
      }
    })
  }
  return (
    <li className='border-b py-2 border-gray-500' key={todo.id}>
      <div>
        <div className='flex'>
          <div className='flex flex-grow'>
            <label>
              <input
                type='checkbox'
                checked={completed}
                onChange={handleChange}
                className='mr-3 cursor-pointer form-checkbox h-6 w-6 border hover:form-checkbox border-gray-300 rounded-md checked:color-green-500 checked:bg-blue-600 checked:border-transparent focus:outline-none'
              />
            </label>
            <EditTextInput
              completed={completed}
              updateTodo={updateTodo}
              todo={todo}
            />
          </div>
          <div className='flex'>
            <div
              className='mr-2 h-6 w-6 text-gray-500 hover:text-black cursor-pointer'
              onClick={() => {
                let updatedTodo = {
                  ...todo,
                  deleted: true
                }
                updateTodo({
                  variables: {
                    todo: updatedTodo
                  },
                  optimisticResponse: updatedTodo
                })
              }}
            >
              <Dustbin />
            </div>
            <div className='text-sm'>
              <div className='cursor-pointer'>
                <Link href={`/todo/${encodeURIComponent(todo.id)}`}>
                  <a>
                    <div className='flex'>
                      <div className='h-6 w-6 text-gray-500'>
                        <CommentsIcon />
                      </div>
                      <div className='ml-1 text-xs'>{todo.commentsCount}</div>
                    </div>
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </li>
  )
}

const EditTextInput = ({ completed, updateTodo, todo }) => (
  <Formik
    initialValues={{
      text: todo.text
    }}
    validateOnChange={false}
    validationSchema={object().shape({
      text: string().required('Please provide text')
    })}
    onSubmit={(values, { setErrors }) => {
      setErrors({
        text: false
      })
      let { text } = values
      let updatedTodo = {
        ...todo,
        text
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
            textSize='text-xl'
            style={{ boxSizing: 'border-box' }}
            onChange={handleChange}
            name='text'
            value={values.text}
            completed={completed}
          />
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
        text: ''
      }}
      validateOnChange={false}
      validationSchema={object().shape({
        text: string().required('Please provide a text')
      })}
      onSubmit={(values, { setErrors, resetForm }) => {
        setErrors({
          text: false
        })
        let { text } = values
        const id = uuidv4()
        // get parent ID from URL
        //mutation example + optimistic response
        addTodo({
          variables: {
            todo: {
              user: 'mbg@outlook.com',
              text,
              position,
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
        return (
          <Form className='w-full'>
            <Input
              textSize='text-xl'
              style={{ boxSizing: 'border-box' }}
              onChange={handleChange}
              name='text'
              value={values.text}
            />
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

const CommentsIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 20 20'
    fill='currentColor'
  >
    <path
      fillRule='evenodd'
      d='M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z'
      clipRule='evenodd'
    />
  </svg>
)

const Rating = ({ value }) => {
  let bgColor = 'bg-green-500'
  if (value > 2) bgColor = 'bg-yellow-500'
  if (value > 5) bgColor = 'bg-red-500'

  return <div className={`${bgColor} rounded-full h-5 w-5`} />
}

const Apollo = withApollo({ ssr: true })(TodoFetcher)

Apollo.getInitialProps = async ({ query }) => {
  return { id: query.id }
}

export default Apollo
