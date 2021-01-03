import { useMutation } from '@apollo/client'
import { Formik, Form } from 'formik'
import { string, object } from 'yup'
import gql from 'graphql-tag'
import { v4 as uuidv4 } from 'uuid'
import { Textarea, Header, Button, Subheader } from './index'
import { AddComment as ADD_COMMENT } from '../queries/index'

const CommentInput = ({ todoId, comments }) => {
  return (
    <div>
      {comments.length > 0 && (
        <div>
          <Subheader>Comments</Subheader>
          <ul className='mb-4'>
            {comments.map(comment => (
              <Comment comment={comment} key={comment.id} />
            ))}
          </ul>
        </div>
      )}
      <Subheader>Add comment</Subheader>
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
              commentsCount: existingTodo.commentsCount + 1,
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
            comment: {
              user: 'mbg@outlook.com',
              text,
              todoId,
              id
            }
          },
          optimisticResponse: {
            __typename: 'Mutation',
            addComment: {
              __typename: 'Comment',
              text,
              id,
              todoId,
              user: 'mbg@outlook.com',
              createdAt: 'Just now'
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
            <Textarea onChange={handleChange} name='text' value={values.text} />
            <div className='mt-1'>
              {
                <div>
                  <div>{errors.text || errors.serverError}</div>
                </div>
              }
            </div>
            <div className='flex justify-end'>
              <Button
                className=' bg-green-500 py-2 px-3 text-white text-xl font-bold'
                type='submit'
              >
                Add
              </Button>
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
    <li className='border-b-2 py-2 border-gray-500' key={comment.id}>
      <div className='flex'>
        <div className='mr-1 h-5 w-5'>
          <User />
        </div>
        <div>Michael Goulbourn</div>
      </div>
      <div className='flex justify-end text-xs text-gray-500'>
        {comment.createdAt}
      </div>
      <div className='text-xl font-medium'>{comment.text}</div>
    </li>
  )
}

const User = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 20 20'
    fill='currentColor'
  >
    <path
      fillRule='evenodd'
      d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z'
      clipRule='evenodd'
    />
  </svg>
)

export default CommentInput
