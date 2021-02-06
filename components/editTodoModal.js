import { useMutation } from '@apollo/client'
import { Formik } from 'formik'
import { string, object } from 'yup'
import {
  MainContainer as Container,
  Back,
  Subheader,
  TodoForm,
  Card
} from './index'
import toast from 'react-hot-toast'
import { UpdateTodo as UPDATE_TODO } from '../queries/index'

const EditTodoModal = ({ todo, closeModal }) => (
  <div>
    <Back closeModal={closeModal} title={todo.text} />
    <Card>
      <Subheader>Edit todo</Subheader>
      <TextInput todo={todo} />
    </Card>
  </div>
)

const TextInput = ({ todo }) => {
  let { contact, text, priority } = todo
  const [updateTodo] = useMutation(UPDATE_TODO)

  return (
    <Formik
      initialValues={{
        text,
        priority: priority || '',
        contact: contact || ''
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
        let mutation = updateTodo({
          variables: {
            todo: {
              ...todo,
              text,
              contact,
              priority
            }
          }
        })

        toast.promise(mutation, {
          loading: 'Loading',
          success: data => `Successfully edited todo`,
          error: err => `This just happened: ${err.toString()}`
        })
      }}
    >
      {props => {
        return <TodoForm {...props} />
      }}
    </Formik>
  )
}

export default EditTodoModal
