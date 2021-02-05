import { useMutation } from '@apollo/client'
import { Formik } from 'formik'
import { string, object } from 'yup'
import toast from 'react-hot-toast'
import { Back, Subheader, TodoForm, Card } from './index'
import { AddTodo as ADD_TODO } from '../queries/index'
import gql from 'graphql-tag'
import { v4 as uuidv4 } from 'uuid'

const AddTodoModal = ({ id, name, closeModal }) => {
  return (
    <div>
      <Back closeModal={closeModal} title={name} />
      <Card>
        <Subheader>Add todo</Subheader>
        <TextInput parentId={id} />
      </Card>
    </div>
  )
}

const TextInput = ({ parentId }) => {
  const [addTodo] = useMutation(ADD_TODO, {
    update (cache, { data: { addTodo } }) {
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
                  text
                  completed
                  deleted
                  user
                  createdSince
                  commentsCount
                }
              `
            })
            return [...existingTodos, newTodoRef]
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
          completed: false,
          deleted: false,
          id,
          todoListId: parentId
        }
        let mutation = addTodo({
          variables: { todo }
        })

        toast.promise(mutation, {
          loading: 'Loading',
          success: data => `Successfully saved todo`,
          error: err => `This just happened: ${err.toString()}`
        })

        resetForm()
      }}
    >
      {props => {
        return <TodoForm {...props} />
      }}
    </Formik>
  )
}

export default AddTodoModal
