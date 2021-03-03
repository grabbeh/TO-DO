import { useMutation } from '@apollo/client'
import { UpdateTodo as UPDATE_TODO } from '../queries/index'
import activateToast from '../utils/toast'
import { AiFillPushpin, AiOutlineCopy, AiOutlinePushpin } from 'react-icons/ai'
import gql from 'graphql-tag'
import _ from 'lodash'

const query = gql`
  query allTodos(
    $olderThan: Int
    $earlierThan: Int
    $priority: String
    $status: String
    $pinned: Boolean
  ) {
    allTodos(
      olderThan: $olderThan
      earlierThan: $earlierThan
      priority: $priority
      status: $status
      pinned: $pinned
    ) {
      id
      todoListId
      text
      contact
      priority
      user
      completed
      deleted
      createdSince
      commentsCount
      todoListName
      pinned
    }
  }
`

const PinTodo = ({ todo }) => {
  const [updatePinnedStatus, { client }] = useMutation(UPDATE_TODO, {
    update ({ data: updateTodo }) {
      let data = client.readQuery({
        query,
        variables: { pinned: true }
      })

      let d = data?.allTodos || []
      let copy = _.clone(d)
      let updated
      if (_.find(copy, { id: todo.id })) {
        updated = copy.filter(i => {
          return i.id !== todo.id
        })
        client.writeQuery({
          query,
          variables: { pinned: true },
          data: {
            allTodos: updated
          }
        })
      } else {
        copy.push(updateTodo)
        client.writeQuery({
          query,
          variables: { pinned: true },
          data: {
            allTodos: AiOutlineCopy
          }
        })
      }
    }
  })
  return (
    <div
      className='cursor-pointer'
      onClick={() => {
        let updatedTodo = {
          ...todo,
          pinned: !todo.pinned
        }
        let mutation = updatePinnedStatus({
          variables: {
            todo: updatedTodo
          },
          optimisticResponse: {
            __typename: 'Mutation',
            updateTodo: updatedTodo
          }
        })
        activateToast(mutation, 'Todo pinned')
      }}
    >
      <div>
        {todo.pinned ? (
          <div className='text-red-600'>
            <AiFillPushpin />
          </div>
        ) : (
          <div className='text-gray-500'>
            <AiOutlinePushpin />
          </div>
        )}
      </div>
    </div>
  )
}

export default PinTodo
