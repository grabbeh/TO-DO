import { useMutation } from '@apollo/client'
import { Formik, Form } from 'formik'
import { string, object } from 'yup'
import gql from 'graphql-tag'
import { Textarea, Button, Subheader, Card as MainCard } from './index'
import { AddComment as ADD_COMMENT } from '../queries/index'
import { User, Cross } from '../components/icons/index'
import toast from 'react-hot-toast'

const CommentInput = ({ todo, comments, showComments, setShowComments }) => {
  return (
    <div
      className={`${
        showComments ? 'inline-block absolute' : 'hidden'
      }  bg-white border-l-2 md:sticky h-screen flex-none w-full top-0`}
    >
      <div className='flex justify-between'>
        <div className='pl-2'>
          <div className='text-sm text-gray-500'>{todo.todoListName}</div>
          <Subheader>{todo.text} </Subheader>
        </div>
        <div
          className='h-8 w-8 cursor-pointer hover:text-black text-gray-500'
          onClick={() => setShowComments(false)}
        >
          <Cross />
        </div>
      </div>
      {comments.length > 0 && (
        <div className='p-2'>
          <div>Comments</div>
          <ul className='divide-y-2'>
            {comments.map(comment => (
              <Comment comment={comment} key={comment.id} />
            ))}
          </ul>
        </div>
      )}
      <MainCard>
        <TextInput todoId={todo.id} />
      </MainCard>
    </div>
  )
}

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

        let comment = {
          __typename: 'Comment',
          text,
          todoId
        }
        let mutation = addComment({
          variables: {
            comment
          },
          optimisticResponse: {
            __typename: 'Mutation',
            addComment: { ...comment, id: '', createdAt: 'Just now' }
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
          <Form>
            <Textarea
              className='text-base'
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
              <Button type='submit'>Add</Button>
            </div>
          </Form>
        )
      }}
    </Formik>
  )
}

const Comment = ({ comment }) => (
  <li className='py-2' key={comment.id}>
    <div className='justify-between flex'>
      <div className='flex'>
        <div className='mr-1 h-5 w-5'>
          <User />
        </div>
        <div className='font-semibold'>Michael Goulbourn</div>
      </div>
      <div className='text-xs text-gray-500'>{comment.createdAt}</div>
    </div>

    <div className='text-gray-500 text-lg'>{comment.text}</div>
  </li>
)

export default CommentInput
