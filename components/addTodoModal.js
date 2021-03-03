import { useMutation } from '@apollo/client'
import { Formik } from 'formik'
import { string, object } from 'yup'
import activateToast from '../utils/toast'
import { Back, Subheader, TodoForm, Card } from './index'
import { AddTodo as ADD_TODO } from '../queries/index'
import gql from 'graphql-tag'

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
      console.log(cache)
      cache.modify({
        //id: cache.identify({ id: parentId, __typename: 'TodoList' }),
        fields: {
          activeTodosVolume (value) {
            return value + 1
          },
          allTodos (existingTodos = []) {
            console.log('allTodos value')
            console.log(existingTodos)
            const newTodoRef = cache.writeFragment({
              data: addTodo,
              fragment: gql`
                fragment NewTodo on Todo {
                  id
                  todoListId
                  todoListName
                  status
                  text
                  contact
                  priority
                  user
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
        let todo = {
          __typename: 'Todo',
          text,
          contact,
          priority,
          status: 'ACTIVE',
          pinned: false,
          todoListId: parentId
        }
        let mutation = addTodo({
          variables: { todo },
          optimisticResponse: {
            __typename: 'Mutation',
            addTodo: {
              ...todo,
              id: '',
              todoListName: '',
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
