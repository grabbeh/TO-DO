import { useMutation } from '@apollo/client'
import { Formik } from 'formik'
import { string, object } from 'yup'
import gql from 'graphql-tag'
import { TodolistForm, Back, Card, Subheader } from '../components/index'
import { AddTodoList as ADD_TODOLIST } from '../queries/index'

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
                  org
                  deleted
                  user
                  activeTodosVolume
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
        console.log(values)
        setErrors({
          name: false
        })
        let { name } = values
        let todoList = {
          __typename: 'TodoList',
          name
        }
        addTodoList({
          variables: {
            todoList
          },
          optimisticResponse: {
            __typename: 'Mutation',
            addTodoList: {
              ...todoList,
              id: '',
              user: '',
              org: '',
              deleted: false,
              activeTodosVolume: 0
            }
          }
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
