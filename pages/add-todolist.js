import { useMutation } from '@apollo/client'
import { Formik } from 'formik'
import { string, object } from 'yup'
import gql from 'graphql-tag'
import { v4 as uuidv4 } from 'uuid'
import {
  MainContainer as Container,
  TodolistForm,
  Back,
  Card
} from '../components/index'
import { AddTodoList as ADD_TODOLIST } from '../queries/index'
import withApollo from '../lib/withApollo'
import toast from 'react-hot-toast'

const AddTodoListPage = () => (
  <Container>
    <Back title='Add todo list' />
    <Card>
      <TextInput />
    </Card>
  </Container>
)

const TextInput = () => {
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
        let mutation = addTodoList({
          variables: {
            todoList: { user: 'mbg@outlook.com', name, id }
          },
          optimisticResponse: {
            __typename: 'Mutation',
            addTodoList: {
              __typename: 'TodoList',
              name,
              id,
              deleted: false,
              user: 'mbg@outlook.com',
              completedTodos: 0,
              totalTodos: 0
            }
          }
        })
        toast.promise(mutation, {
          loading: 'Loading',
          success: data => `Successfully added todolist`,
          error: err => `This just happened: ${err.toString()}`
        })
        resetForm()
      }}
    >
      {props => {
        return <TodolistForm {...props} />
      }}
    </Formik>
  )
}

const Apollo = withApollo({ ssr: true })(AddTodoListPage)

export default Apollo
