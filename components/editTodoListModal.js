import { useMutation, useQuery } from '@apollo/client'
import { Formik } from 'formik'
import { string, object } from 'yup'
import toast from 'react-hot-toast'
import {
  TodolistForm,
  Loading,
  MainContainer as Container,
  Back,
  Card,
  Subheader
} from '../components/index'
import {
  TodoList as TODO_LIST_QUERY,
  UpdateTodoList as UPDATE_TODOLIST
} from '../queries/index'

const EditTodoListModal = ({ closeModal, todoList }) => (
  <div>
    <Back closeModal={closeModal} title={todoList.name} />
    <Card>
      <Subheader>Edit todo list</Subheader>
      <EditTextInput todoList={todoList} />
    </Card>
  </div>
)

const EditTextInput = ({ todoList }) => {
  const [updateTodoList] = useMutation(UPDATE_TODOLIST)
  return (
    <Formik
      initialValues={{
        name: todoList.name
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
        let updatedTodoList = {
          ...todoList,
          name
        }
        let mutation = updateTodoList({
          variables: {
            todoList: updatedTodoList
          }
        })
        toast.promise(mutation, {
          loading: 'Loading',
          success: data => `Todo list updated`,
          error: err => `This just happened: ${err.toString()}`
        })
        resetForm()
        closeModal()
      }}
    >
      {props => {
        return <TodolistForm {...props} />
      }}
    </Formik>
  )
}

export default EditTodoListModal
