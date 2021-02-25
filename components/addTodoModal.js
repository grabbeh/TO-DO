import { useMutation } from '@apollo/client'
import { Formik } from 'formik'
import { string, object } from 'yup'
import activateToast from '../utils/toast'
import { Back, Subheader, TodoForm, Card } from './index'
import { AddTodo as ADD_TODO } from '../queries/index'
import gql from 'graphql-tag'
import { v4 as uuidv4 } from 'uuid'

const AddTodoModal = ({ id, name, closeModal }) => (
  <div>
    <Back closeModal={closeModal} title={name} />
    <Card>
      <Subheader>Add todo</Subheader>
      <TextInput closeModal={closeModal} parentId={id} />
    </Card>
  </div>
)

const TextInput = ({ parentId, closeModal }) => {
  const [addTodo] = useMutation(ADD_TODO, {
    update (cache, { data: { addTodo } }) {
      console.log(addTodo)
      cache.modify({
        id: cache.identify({ id: parentId, __typename: 'TodoList' }),
        fields: {
          activeTodosVolume (value) {
            return value + 1
          },
          activeTodos (existingTodos = []) {
            const newTodoRef = cache.writeFragment({
              data: addTodo,
              fragment: gql`
                fragment NewTodo on Todo {
                  id
                  todoListId
                  todoListName
                  text
                  contact
                  priority
                  user
                  completed
                  deleted
                  pinned
                  createdSince
                  commentsCount
                }
              `
            })
            return [newTodoRef, ...existingTodos]
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
          todoListName: '...',
          completed: false,
          deleted: false,
          pinned: false,
          id,
          todoListId: parentId
        }
        let mutation = addTodo({
          variables: { todo },
          optimisticResponse: {
            __typename: 'Mutation',
            addTodo: {
              ...todo,
              commentsCount: 0,
              createdSince: 'Just now'
            }
          }
        })
        activateToast(mutation, 'Todo added')
        resetForm()
        closeModal()
      }}
    >
      {props => {
        return <TodoForm {...props} />
      }}
    </Formik>
  )
}

export default AddTodoModal
