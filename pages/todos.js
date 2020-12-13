import { useQuery, useMutation } from '@apollo/client'
import { useState } from 'react'
import { Container, Input, Header } from '../components/index'
import TODOS_QUERY from '../queries/ToDosQuery'
import ADD_TODO from '../queries/AddToDoMutation'
import { Formik, Form } from 'formik'
import { string, object } from 'yup'
import withApollo from '../lib/withApollo'
import gql from 'graphql-tag'

const ToDoPage = () => {
  const { loading, error, data } = useQuery(TODOS_QUERY)
  if (loading) return 'Loading'
  if (error) return 'Error'
  const [addToDo] = useMutation(ADD_TODO, {
    update (cache, { data: { addToDo } }) {
      cache.modify({
        fields: {
          todos (todos = []) {
            const newTodoRef = cache.writeFragment({
              id: `ToDo:${addToDo.id}`,
              data: addToDo,
              fragment: gql`
                fragment NewTodo on ToDo {
                  id
                  text
                  completed
                  deleted
                  user
                }
              `
            })
            return [...todos, newTodoRef]
          }
        }
      })
    }
  })
  return (
    <Container>
      <h1 className='font-bold text-4xl'>To-dos</h1>
      <div>
        <ul>
          {data &&
            data.todos &&
            data.todos.map(todo => (
              <ToDo key={todo.id} addToDo={addToDo} todo={todo} />
            ))}
          <li>
            <TextInput addToDo={addToDo} />
          </li>
        </ul>
      </div>
    </Container>
  )
}

export default withApollo({ ssr: true })(ToDoPage)

const ToDo = props => {
  let { todo, addToDo } = props
  let [completed, setCompleted] = useState(todo.completed)
  let [editable, setEditable] = useState(false)
  let handleChange = () => {
    setCompleted(!completed)
    addToDo({
      variables: {
        todo: { ...todo, completed: !completed }
      }
    })
  }
  return (
    <li className='my-3' key={todo.id}>
      {!todo.deleted && (
        <div className='flex justify-between'>
          <div className='flex'>
            <label className='flex items-center space-x-3'>
              <input
                type='checkbox'
                checked={completed}
                onChange={handleChange}
                className='mr-3 cursor-pointer form-checkbox h-6 w-6 border hover:form-checkbox border-gray-300 rounded-md checked:color-green-500 checked:bg-blue-600 checked:border-transparent focus:outline-none'
              />
            </label>
            {editable ? (
              <EditTextInput
                addToDo={addToDo}
                todo={todo}
                setEditable={setEditable}
              />
            ) : (
              <span
                onDoubleClick={() => {
                  setEditable(true)
                }}
                className={`text-gray-900 ${completed &&
                  'line-through'} text-2xl font-medium`}
              >
                {todo.text}
              </span>
            )}
          </div>
          <div className='flex'>
            {!editable && (
              <div
                onClick={() => {
                  setEditable(true)
                }}
                className='ml-2 h-6 w-6 text-gray-500 hover:text-black cursor-pointer'
              >
                <Edit />
              </div>
            )}
            {!todo.deleted && (
              <div
                className='h-6 w-6 text-gray-500 hover:text-black cursor-pointer'
                onClick={() => {
                  addToDo({
                    variables: {
                      todo: { ...todo, deleted: true }
                    }
                  })
                }}
              >
                <Dustbin />
              </div>
            )}
          </div>
        </div>
      )}
    </li>
  )
}

const EditTextInput = ({ addToDo, setEditable, todo }) => (
  <Formik
    initialValues={{
      text: todo.text
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
      addToDo({
        variables: {
          todo: {
            ...todo,
            text
          }
        }
      })
      resetForm()
      setEditable(false)
    }}
  >
    {props => {
      const { values, errors, handleChange } = props
      return (
        <Form>
          <Input
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

const TextInput = ({ addToDo }) => {
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
        addToDo({ variables: { todo: { text } } })
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
