import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { Formik, Form } from 'formik'
import { string, object } from 'yup'
import gql from 'graphql-tag'
import { v4 as uuidv4 } from 'uuid'
import { Input } from './index'
import { AddComment as ADD_COMMENT } from '../queries/index'

const CommentInput = ({ todoId }) => {
  return (
    <div className='mr-5'>
      <h1 className='font-bold text-sm'>Add comment</h1>
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
          comments (existingComments = []) {
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
            return [...existingComments, newCommentRef]
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
          <Form>
            <Input
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
          </Form>
        )
      }}
    </Formik>
  )
}

export default CommentInput
