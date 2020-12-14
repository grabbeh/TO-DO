import { useQuery, useMutation, useApolloClient } from '@apollo/client'
import { useState } from 'react'
import { Container, Input } from '../components/index'
import TODOS_QUERY from '../queries/ToDosQuery'
import ADD_TODO from '../queries/AddToDoMutation'
import { Formik, Form } from 'formik'
import { string, object } from 'yup'
import withApollo from '../lib/withApollo'
import gql from 'graphql-tag'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import NoSSR from 'react-no-ssr'

const ToDoDataFetcher = () => {
  const { loading, error, data } = useQuery(TODOS_QUERY)
  if (loading) return 'Loading'
  if (error) return 'Error'
  return <ToDoPage unsortedTodos={data.todos} />
}

const ToDoPage = ({ unsortedTodos }) => {
  const client = useApolloClient()
  let todos = sortToDos(unsortedTodos)
  const [addToDo] = useMutation(ADD_TODO, {
    update (cache, { data: { addToDo } }) {
      cache.modify({
        fields: {
          todos (todos = []) {
            const newTodoRef = cache.writeFragment({
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
            return [...todos, addToDo]
          }
        }
      })
    }
  })

  const [updateToDo] = useMutation(ADD_TODO)

  const [updateCompleted] = useMutation(ADD_TODO, {
    update (cache, { data: { addToDo } }) {
      cache.modify({
        fields: {
          todos (todos = []) {
            cache.writeFragment({
              id: `ToDo:${addToDo.id}`,
              fragment: gql`
                fragment CompleteTodo on ToDo {
                  completed
                }
              `,
              data: {
                completed: addToDo.completed
              }
            })
          }
        }
      })
    }
  })

  const [deleteToDo] = useMutation(ADD_TODO, {
    update (cache, { data: { addToDo } }) {
      cache.modify({
        fields: {
          todos (existingTodoRefs = [], { readField }) {
            let updated = existingTodoRefs.filter(ref => {
              let existingId = readField('id', ref)
              return existingId !== addToDo.id
            })
            return [...updated]
          }
        }
      })
    }
  })

  const onDragEnd = result => {
    if (!result.destination) {
      return
    }

    const { todos } = client.readQuery({
      query: TODOS_QUERY
    })
    const items = reorder(todos, result.source.index, result.destination.index)
    items.forEach((todo, index) => {
      updateToDo({
        variables: {
          todo: { ...todo, position: index }
        },
        optimisticResponse: {
          __typename: 'Mutation',
          updateToDo: {
            id: `ToDo${todo.id}`,
            __typename: 'ToDo',
            ...todo,
            position: index
          }
        }
      })

      client.writeFragment({
        id: `ToDo:${todo.id}`,
        fragment: gql`
          fragment PositionTodo on ToDo {
            position
          }
        `,
        data: {
          position: index
        }
      })
    })
    /*

        /*
    stackoverflow.com/questions/52360171/optimistic-react-apollo-ui-lag-with-react-beautiful-drag-and-drop
    Effect of supplying variables to writeQuery?

    client.writeQuery({
      query: TODOS_QUERY,
      data: {
        todos: [...items]
      }
    })*/
  }
  return (
    <Container>
      <h1 className='mb-3 font-bold text-4xl'>To-dos</h1>
      <NoSSR>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId='droppable'>
            {provided => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                <ul>
                  {todos.map((todo, index) => (
                    <Draggable
                      key={todo.id}
                      draggableId={todo.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <ToDo
                          innerRef={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}
                          addToDo={addToDo}
                          deleteToDo={deleteToDo}
                          updateCompleted={updateCompleted}
                          updateToDo={updateToDo}
                          todo={todo}
                        />
                      )}
                    </Draggable>
                  ))}
                  <li>
                    <TextInput position={todos.length} addToDo={addToDo} />
                  </li>
                  {provided.placeholder}
                </ul>
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </NoSSR>
    </Container>
  )
}

const ToDo = props => {
  let {
    todo,
    addToDo,
    deleteToDo,
    updateToDo,
    updateCompleted,
    innerRef,
    ...rest
  } = props
  let [completed, setCompleted] = useState(todo.completed)
  let [editable, setEditable] = useState(false)
  let handleChange = () => {
    setCompleted(!completed)
    updateCompleted({
      variables: {
        todo: { ...todo, completed: !completed }
      }
    })
  }
  return (
    <li {...rest} ref={innerRef} key={todo.id}>
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
            {editable ? (
              <EditTextInput
                updateToDo={updateToDo}
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
                  deleteToDo({
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

const EditTextInput = ({ updateToDo, setEditable, todo }) => (
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

const TextInput = ({ addToDo, position = 0 }) => {
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
        addToDo({ variables: { todo: { text, position } } })
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

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: 'none',
  borderBottom: isDragging && '3px solid gray',
  ...draggableStyle
})

export default withApollo({ ssr: true })(ToDoDataFetcher)
