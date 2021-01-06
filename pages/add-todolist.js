import { useMutation } from '@apollo/client'
import { Formik } from 'formik'
import { string, object } from 'yup'
import gql from 'graphql-tag'
import { v4 as uuidv4 } from 'uuid'
import {
  MainContainer as Container,
  TodolistForm,
  Back
} from '../components/index'
import { AddTodoList as ADD_TODOLIST } from '../queries/index'
import withApollo from '../lib/withApollo'

const EditTodoListPage = () => (
  <Container>
    <Back title='Add todo list' />
    <TextInput />
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
        addTodoList({
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
              user: 'mbg@outlook.com'
            }
          }
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

const Apollo = withApollo({ ssr: true })(EditTodoListPage)

export default Apollo
