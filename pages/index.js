import { useQuery, useMutation, useApolloClient } from '@apollo/client'
import { useState } from 'react'
import { Container, Input } from '../components/index'
import TODOS_QUERY from '../queries/ToDosQuery'
import ADD_TODO from '../queries/AddToDoMutation'
import UPDATE_TODO from '../queries/UpdateToDoMutation'
import { Formik, Form } from 'formik'
import { string, object } from 'yup'
import withApollo from '../lib/withApollo'
import gql from 'graphql-tag'
import { v4 as uuidv4 } from 'uuid'

const ToDoDataFetcher = () => {
  const { loading, error, data } = useQuery(TODOS_QUERY)
  if (loading) return 'Loading'
  if (error) return 'Error'
  return <ToDoPage todos={data.todos} />
}

const ToDoPage = ({ todos }) => {
  // Simple mutation to rely on automatic cache updating based on ID for single entities (hopefully)
  const [updateToDo] = useMutation(UPDATE_TODO)

  return (
    <Container>
      <h1 className='mb-3 font-bold text-4xl'>To-dos</h1>
      <ul>
        {todos.map(todo => (
          <ToDo key={todo.id} updateToDo={updateToDo} todo={todo} />
        ))}
        <li>
          <TextInput position={todos.length} />
        </li>
      </ul>
    </Container>
  )
}

const ToDo = props => {
  let { todo, updateToDo } = props
  /*
  Cache modify shouldn't be necessary as just updating an existing item
  const [updateCompleted] = useMutation(UPDATE_TODO, {
    update (cache, { data: { updateToDo } }) {
      console.log(cache)
       
      cache.modify({
        fields: {
          todos (todos = []) {
            cache.writeFragment({
              id: `ToDo:${updateToDo.id}`,
              fragment: gql`
                fragment CompleteTodo on ToDo {
                  completed
                }
              `,
              data: {
                completed: updateToDo.completed
              }
            })
          }
        }
      })
    }
  })*/
  /*
  // As we are not actually deleting the item, just updated the 'deleted' property, shouldn't 
  be a need to remove from cache
  const [deleteToDo] = useMutation(UPDATE_TODO, {
    update (cache, { data: updateToDo }) {
      cache.modify({
        fields: {
          todos (existingTodoRefs = [], { readField }) {
            let updated = existingTodoRefs.filter(ref => {
              let existingId = readField('id', ref)
              return existingId !== updateToDo.id
            })
            return [...updated]
          }
        }
      })
    }
  })
*/
  let [completed, setCompleted] = useState(todo.completed)

  let handleChange = () => {
    setCompleted(!completed)
    updateToDo({
      variables: {
        todo: { ...todo, completed: !completed }
      }
    })
  }
  return (
    <li key={todo.id}>
      {!todo.deleted && (
        <div className='pb-2 flex justify-between'>
          <div className='flex flex-grow'>
            <label className='flex items-center'>
              <input
                type='checkbox'
                checked={completed}
                onChange={handleChange}
                className='mr-3 cursor-pointer form-checkbox h-6 w-6 border hover:form-checkbox border-gray-300 rounded-md checked:color-green-500 checked:bg-blue-600 checked:border-transparent focus:outline-none'
              />
            </label>
            <EditTextInput
              completed={completed}
              updateToDo={updateToDo}
              todo={todo}
            />
          </div>
          <div className='flex'>
            <div className='mr-2'>
              <Rating value={todo.createdSince} />
            </div>

            <div
              className='h-6 w-6 text-gray-500 hover:text-black cursor-pointer'
              onClick={() => {
                updateToDo({
                  variables: {
                    todo: { ...todo, deleted: true }
                  },
                  optimisticResponse: {
                    __typename: 'Mutation',
                    updateToDo: {
                      id: `ToDo:${todo.id}`,
                      __typename: 'ToDo',
                      ...todo,
                      deleted: true
                    }
                  }
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

const EditTextInput = ({ completed, updateToDo, todo }) => (
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

      updateToDo({
        variables: {
          todo: {
            ...todo,
            text
          }
        },
        optimisticResponse: {
          __typename: 'Mutation',
          updateToDo: {
            id: `ToDo:${todo.id}`,
            __typename: 'ToDo',
            text
          }
        }
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

const TextInput = ({ position = 0 }) => {
  const [addToDo] = useMutation(ADD_TODO, {
    update (cache, { data: { addToDo } }) {
      cache.modify({
        fields: {
          todos (existingTodos = []) {
            const newToDoRef = cache.writeFragment({
              data: addToDo,
              fragment: gql`
                fragment NewTodo on ToDo {
                  id
                  text
                  completed
                  deleted
                  user
                  position
                }
              `
            })
            return [...existingTodos, newToDoRef]
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
        //mutation example + optimistic response
        addToDo({
          variables: { todo: { user: 'mbg@outlook.com', text, position, id } },
          optimisticResponse: {
            __typename: 'Mutation',
            addToDo: {
              __typename: 'ToDo',
              text,
              id,
              position,
              deleted: false,
              completed: false,
              user: 'mbg@outlook.com'
            }
          }
          // for a new item, optimisticResponse needs typename and the id of the
          // item that will be returned - so id creation has to happen client-side
        })
        // cache only example
        /*
        const data = client.readQuery({ query: TODOS_QUERY })

        // Create a new to-do item
        const myNewTodo = {
          id: position,
          text: text,
          completed: false,
          deleted: false,
          position,
          user: 'mbg@outlook.com',
          __typename: 'ToDo'
        }

        // Write back to the to-do list, appending the new item
        client.writeQuery({
          query: TODOS_QUERY,
          data: {
            todos: [...data.todos, myNewTodo]
          }
        })*/
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

const sortToDos = arr => {
  return arr.slice().sort((a, b) => {
    return a.position - b.position
  })
}

const reorder = (list, sourceIndex, destinationIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(sourceIndex, 1)
  result.splice(destinationIndex, 0, removed)
  return result
}

const Rating = ({ value }) => {
  let bgColor = 'bg-green-500'
  if (value > 2) bgColor = 'bg-yellow-500'
  if (value > 5) bgColor = 'bg-red-500'

  return <div className={`${bgColor} rounded-full h-5 w-5`} />
}

export default withApollo({ ssr: true })(ToDoDataFetcher)
