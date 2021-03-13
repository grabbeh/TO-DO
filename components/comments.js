import { useMutation, useQuery } from '@apollo/client'
import { Formik, Form } from 'formik'
import { string, object } from 'yup'
import gql from 'graphql-tag'
import { Textarea, Button, Subheader, Card as MainCard } from './index'
import {
  AddComment as ADD_COMMENT,
  ActiveTodo as ACTIVE_TODO
} from '../queries/index'
import { User, Cross } from '../components/icons/index'
import { useRouter } from 'next/router'

const CommentInput = ({ comments, showComments, setShowComments }) => {
  const router = useRouter()
  const { id } = router.query
  const { data: activeTodo } = useQuery(ACTIVE_TODO)
  console.log(activeTodo)

  return (
    <div
      className={`${
        showComments ? 'inline-block' : 'hidden'
      }  bg-white border-l w-full md:flex md:flex-col h-screen flex-none top-0`}
    >
      <div className='bg-white w-full flex-grow-0 border-b flex justify-between'>
        <div className='mb-1 pl-2'>
          <div className='text-sm text-gray-500'>
            {activeTodo.activeTodo.todoListName}
          </div>
          <Subheader>{activeTodo.activeTodo.text} </Subheader>
        </div>

        <div
          className='h-8 w-8 cursor-pointer hover:text-black text-gray-500'
          onClick={() => {
            setShowComments(false)
            router.push(`/todos/${id}`, undefined, {
              shallow: true
            })
          }}
        >
          <Cross />
        </div>
      </div>
      <div className='flex-grow overflow-y-hidden relative'>
        <div className='absolute inset-0 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-300 scrollbar-thumb-rounded'>
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
            <TextInput todoId={activeTodo.activeTodo.id} />
          </MainCard>
        </div>
      </div>
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
        addComment({
          variables: {
            comment
          },
          optimisticResponse: {
            __typename: 'Mutation',
            addComment: { ...comment, id: '', createdAt: 'Just now' }
          }
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

    <div className='text-gray-500 text-base'>{comment.text}</div>
  </li>
)

export default CommentInput
