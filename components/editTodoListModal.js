import { useMutation, useQuery } from '@apollo/client'
import { Formik } from 'formik'
import { string, object } from 'yup'
import activateToast from '../utils/toast'
import { TodolistForm, Back, Card, Subheader } from '../components/index'
import { UpdateTodoList as UPDATE_TODOLIST } from '../queries/index'

const EditTodoListModal = ({ closeModal, todoList }) => (
  <div>
    <Card>
      <Subheader>Edit todo list</Subheader>
      <EditTextInput closeModal={closeModal} todoList={todoList} />
    </Card>
  </div>
)

const EditTextInput = ({ closeModal, todoList }) => {
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
        activateToast(mutation, 'Todo list updated')
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
