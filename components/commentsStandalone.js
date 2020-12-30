import { useMutation } from '@apollo/client'
import { Formik, Form } from 'formik'
import { string, object } from 'yup'
import gql from 'graphql-tag'
import { v4 as uuidv4 } from 'uuid'
import { Textarea } from './index'
import { AddComment as ADD_COMMENT } from '../queries/index'
import { Header } from '../components/index'

const CommentInput = ({ todoId, text, comments }) => {
  return (
    <div>
      <Header>Comments</Header>
      <ul className='mb-4'>
        {comments.map(comment => (
          <Comment comment={comment} key={comment.id} />
        ))}
      </ul>
      <TextInput todoId={todoId} />
    </div>
  )
}

const TextInput = props => {
  let { todoId } = props
  const [addComment] = useMutation(ADD_COMMENT, {
    update (cache, { data: { addComment } }) {
      cache.modify({
        fields: {
          todo (existingTodo = []) {
            const newCommentRef = cache.writeFragment({
              data: addComment,
              fragment: gql`
                fragment NewComment on Comment {
                  id
                  text
                  todoId
                  user
                }
              `
            })

            return {
              ...existingTodo,
              comments: [...existingTodo.comments, newCommentRef]
            }
          }
        }
      })
    }
  })

  return (
    <Formik
      initialValues={{
        text: ''
      }}
      validateOnChange={false}
      validationSchema={object().shape({
        text: string().required('Please provide a comment')
      })}
      onSubmit={(values, { setErrors, resetForm }) => {
        setErrors({
          text: false
        })
        let { text } = values
        const id = uuidv4()
        //mutation example + optimistic response
        addComment({
          variables: {
            comment: { user: 'mbg@outlook.com', text, todoId, id }
          },
          optimisticResponse: {
            __typename: 'Mutation',
            addComment: {
              __typename: 'Comment',
              text,
              id,
              todoId,
              user: 'mbg@outlook.com'
            }
          }
          // for a new item, optimisticResponse needs typename and the id of the
          // item that will be returned - so id creation has to happen client-side
        })
        resetForm()
      }}
    >
      {props => {
        const { values, errors, handleChange } = props
        return (
          <Form className='mb-4'>
            <Textarea
              style={{ boxSizing: 'border-box' }}
              onChange={handleChange}
              name='text'
              value={values.text}
            />
            <div className='mt-1'>
              {
                <div>
                  <div>{errors.text || errors.serverError}</div>
                </div>
              }
            </div>
            <div className='flex justify-end'>
              <button
                className=' bg-green-500 py-2 px-3 text-white text-xl font-bold'
                type='submit'
              >
                Submit
              </button>
            </div>
          </Form>
        )
      }}
    </Formik>
  )
}

const Comment = props => {
  let { comment } = props
  return (
    <li className='border-b py-2 border-gray-500' key={comment.id}>
      <div className='flex '>
        <div className='flex flex-grow'>
          <div className='text-xl font-medium'>{comment.text}</div>
        </div>
      </div>
    </li>
  )
}

export default CommentInput
