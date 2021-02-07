import { useMutation } from '@apollo/client'
import { Formik } from 'formik'
import { string, object } from 'yup'
import gql from 'graphql-tag'
import { v4 as uuidv4 } from 'uuid'
import {
  MainContainer as Container,
  TodolistForm,
  Back,
  Card,
  Subheader
} from '../components/index'
import { AddTodoList as ADD_TODOLIST } from '../queries/index'
import toast from 'react-hot-toast'

const AddTodoListModal = ({ closeModal }) => (
  <div>
    <Back closeModal={closeModal} title='Add todo list' />
    <Card>
      <Subheader>Add todo list</Subheader>
      <TextInput closeModal={closeModal} />
    </Card>
  </div>
)

const TextInput = ({ closeModal }) => {
  const [addTodoList] = useMutation(ADD_TODOLIST, {
    update (cache, { data: { addTodoList } }) {
      cache.modify({
        fields: {
          todoLists (existingTodoLists = []) {
            const newTodoListRef = cache.writeFragment({
              data: addTodoList,
              fragment: gql`
                fragment NewTodoList on TodoList {
                  id
                  name
                  deleted
                  user
                }
              `
            })
            return [...existingTodoLists, newTodoListRef]
          }
        }
      })
    }
  })

  return (
    <Formik
      initialValues={{
        name: ''
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
        const id = uuidv4()
        let todoList = {
          __typename: 'Todolist',
          user: 'mbg@outlook.com',
          name,
          id
        }
        let mutation = addTodoList({
          variables: {
            todoList
          },
          optimisticResponse: {
            __typename: 'Mutation',
            addTodoList: {
              ...todoList,
              deleted: false,
              user: 'mbg@outlook.com',
              activeTodosVolume: 0,
              completedTodosVolume: 0
            }
          }
        })
        toast.promise(mutation, {
          loading: 'Loading',
          success: data => `Todo list added`,
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

export default AddTodoListModal
