import { useMutation, useQuery } from '@apollo/client'
import { Formik, Form } from 'formik'
import { string, object } from 'yup'
import gql from 'graphql-tag'
import { v4 as uuidv4 } from 'uuid'
import {
  Input,
  TodolistForm,
  Loading,
  MainContainer as Container,
  Back,
  Subheader
} from '../../components/index'
import {
  TodoList as TODO_LIST_QUERY,
  UpdateTodoList as UPDATE_TODOLIST
} from '../../queries/index'
import withApollo from '../../lib/withApollo'

const TodoFetcher = props => {
  const { loading, error, data } = useQuery(TODO_LIST_QUERY, {
    fetchPolicy: 'cache-first',
    variables: { id: props.id }
  })
  if (loading || !data) return <Loading />
  if (error) return 'Error'
  console.log(data)
  return <EditTodoListPage todoList={data.todoList} />
}

const EditTodoListPage = ({ todoList }) => {
  return (
    <Container>
      <Back title={todoList.name} />
      <Subheader>Edit todo list</Subheader>
      <EditTextInput todoList={todoList} />
    </Container>
  )
}

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
      onSubmit={(values, { setErrors }) => {
        setErrors({
          name: false
        })
        let { name } = values
        let updatedTodoList = {
          ...todoList,
          name
        }
        updateTodoList({
          variables: {
            todoList: updatedTodoList
          },
          optimisticResponse: updatedTodoList
        })
      }}
    >
      {props => {
        return <TodolistForm {...props} />
      }}
    </Formik>
  )
}

const Apollo = withApollo({ ssr: true })(TodoFetcher)

Apollo.getInitialProps = async ({ query }) => {
  return { id: query.id }
}

export default Apollo
