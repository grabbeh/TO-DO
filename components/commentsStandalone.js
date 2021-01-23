import { useMutation } from '@apollo/client'
import { Formik, Form } from 'formik'
import { string, object } from 'yup'
import gql from 'graphql-tag'
import { v4 as uuidv4 } from 'uuid'
import {
  Textarea,
  Button,
  Subheader,
  Card as MainCard,
  CardListItem as Card
} from './index'
import { AddComment as ADD_COMMENT } from '../queries/index'
import toast from 'react-hot-toast'

const CommentInput = ({ todoId, comments }) => (
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
    <MainCard>
      <Subheader>Add comment</Subheader>
      <TextInput todoId={todoId} />
    </MainCard>
  </div>
)

const TextInput = ({ todoId }) => {
  const [addComment] = useMutation(ADD_COMMENT, {
    update (cache, { data: { addComment } }) {
      cache.modify({
        id: cache.identify({
          id: todoId,
          __typename: 'Todo'
        }),
        fields: {
          commentsCount (value) {
            return value + 1
          },
          comments (existing = []) {
            const newCommentRef = cache.writeFragment({
              data: addComment,
              fragment: gql`
                fragment NewComment on Comment {
                  id
                  text
                  todoId
                  user
                  createdAt
                }
              `
            })
            return [newCommentRef, ...existing]
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
        let comment = {
          __typename: 'Comment',
          user: 'mbg@outlook.com',
          text,
          todoId,
          id,
          createdAt: 'Just now'
        }
        let mutation = addComment({
          variables: {
            comment
          },
          optimisticResponse: {
            __typename: 'Mutation',
            addComment: comment
          }
        })
        toast.promise(mutation, {
          loading: 'Loading',
          success: data => `Successfully added comment`,
          error: err => `This just happened: ${err.toString()}`
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
              <Button bg='bg-green-300' type='submit'>
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
    <Card className='mb-4' key={comment.id}>
      <div className='justify-between flex'>
        <div className='flex'>
          <div className='mr-1 text-gray-500 font-semibold h-5 w-5'>
            <User />
          </div>
          <div className='text-gray-500 font-semibold'>Michael Goulbourn</div>
        </div>
        <div className='text-xs font-semibold text-gray-500'>
          {comment.createdAt}
        </div>
      </div>

      <div className='pb-3 text-xl font:semibold font-medium'>
        {comment.text}
      </div>
    </Card>
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
