import { useMutation } from '@apollo/client'
import {
  CardListItem as Card,
  Subheader,
  TodoOptionsBox,
  PinTodo,
  Loading,
  Button
} from './index'
import { activeCommentsBarVar, activeTodoVar } from '../lib/withApollo'
import Link from 'next/link'
import { Comments, User } from './icons/index'
import { UpdateTodo as UPDATE_TODO } from '../queries/index'
import { useRouter } from 'next/router'

const TodoList = ({ todos, title, fetchMore, loading }) => {
  return (
    <div>
      {title && <Subheader>{title}</Subheader>}
      <ul className='border-b divide-y mb-3'>
        {todos.map(todo => (
          <Todo key={todo.id} todo={todo} />
        ))}
      </ul>
      <div className='mb-5 pl-3'>
        <Button
          className='mx-5 md:mx-0 bg-white p-2 my-5 cursor-pointer text-center font-semibold'
          onClick={() => {
            fetchMore({ variables: { cursor: todos[todos.length - 1].id } })
          }}
        >
          {loading ? <Loading /> : 'More'}
        </Button>
      </div>
    </div>
  )
}

const returnUrl = (existing, todoId) => {
  let newUrl
  if (existing.indexOf('comments') == -1) {
    newUrl = `${existing}/comments/${todoId}`
  } else {
    let removed = removeComments(existing)
    newUrl = `${removed}comments/${todoId}`
  }
  return newUrl
}

const removeComments = url => {
  let index = url.indexOf('comments')
  let updated = url.slice(0, index)
  return updated
}

const Todo = ({ todo }) => {
  const router = useRouter()
  let existingUrl = router.asPath
  const [updateCompletionStatus] = useMutation(UPDATE_TODO, {
    update (cache, { data: { updateTodo } }) {
      let ref = { __ref: `Todo:${todo.id}` }
      cache.modify({
        id: cache.identify({
          id: todo.todoListId,
          __typename: 'TodoList'
        }),
        fields: {
          completedTodos (existing, { readField }) {
            if (updateTodo.status === 'COMPLETED') {
              return [ref, ...existing]
            } else {
              return existing.filter(ref => {
                return todo.id !== readField('id', ref)
              })
            }
          },
          activeTodos (existing, { readField }) {
            if (updateTodo.status !== 'COMPLETED') {
              return [ref, ...existing]
            } else {
              return existing.filter(ref => {
                return todo.id !== readField('id', ref)
              })
            }
          },
          completedTodosVolume (value) {
            if (updateTodo.status === 'COMPLETED') {
              value++
            } else {
              value--
            }
            return value
          },
          activeTodosVolume (value) {
            if (updateTodo.status !== 'COMPLETED') {
              value++
            } else {
              value--
            }
            return value
          }
        }
      })
    }
  })

  return (
    <Card key={todo.id}>
      <div className='flex justify-between'>
        <Link href={`/todos/${encodeURIComponent(todo.todoListId)}`}>
          <a>
            <div className='ml-8 text-sm text-gray-400'>
              {todo.todoListName}
            </div>
          </a>
        </Link>
        <div className='flex justify-end'>
          <PinTodo todo={todo} />
        </div>
      </div>

      <div className='flex'>
        <div>
          <label>
            <input
              type='checkbox'
              checked={todo.status === 'COMPLETED'}
              onChange={() => {
                updateCompletionStatus({
                  variables: {
                    todo: {
                      ...todo,
                      status: todo.status === 'ACTIVE' ? 'COMPLETED' : 'ACTIVE'
                    }
                  },
                  optimisticResponse: {
                    type: 'Mutation',
                    updateTodo: {
                      ...todo,
                      status: todo.status === 'ACTIVE' ? 'COMPLETED' : 'ACTIVE'
                    }
                  }
                })
              }}
              className='mr-3 cursor-pointer form-checkbox h-5 w-5 border-2 hover:form-checkbox border-gray-300 rounded-md checked:color-green-500 checked:bg-blue-600 checked:border-transparent focus:outline-none'
            />
          </label>
        </div>
        <div className='flex-grow'>
          <div className='flex justify-between'>
            <div className='pr-4'>
              <span
                className={`${
                  todo.status === 'COMPLETED' ? 'line-through' : ''
                } flex font-semibold text-gray-900 text-lg`}
              >
                {todo.text}
              </span>
              <div className='flex'>
                <div className='text-gray-500 mr-1 mt-1 h-4 w-4'>
                  <User />
                </div>
                <div className='text-gray-500 text-base'>{todo.contact}</div>
              </div>
            </div>
            <div>
              <div className='flex justify-end flex-shrink'>
                {todo.priority && <Rating priority={todo.priority} />}
              </div>
              <div className='flex justify-end text-base text-right font-semibold text-gray-500'>
                {todo.createdSince}
              </div>
            </div>
          </div>
          <div className='flex self-end'>
            <div className='align-bottom justify-between flex-grow flex'>
              <TodoOptionsBox todo={todo} />
              <div>
                <div className='cursor-pointer'>
                  <div
                    onClick={() => {
                      activeTodoVar(todo)
                      activeCommentsBarVar(true)
                      router.push(returnUrl(existingUrl, todo.id))
                    }}
                    className='flex hover:text-blue-800 text-blue-500'
                  >
                    <div className='h-5 w-5'>
                      <Comments />
                    </div>
                    <div className=' ml-1 text-md font-bold'>
                      {todo.commentsCount}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

const Rating = ({ priority }) => {
  let textColor = 'text-green-500'
  if (priority === 'medium') textColor = 'text-yellow-500'
  if (priority === 'high') textColor = 'text-red-500'
  return (
    <div className={`${textColor} font-bold bg-black-200 rounded`}>
      {priority.toUpperCase()}
    </div>
  )
}

const RemoveItem = (arr, item) => {
  let existingReference = { __ref: `Todo:${todo.id}` }
  if (updateTodo && updateTodo.status !== 'COMPLETED') {
    return [existingReference, ...existing]
  } else {
    return existing.filter(ref => {
      return todo.id !== readField('id', ref)
    })
  }
}

const UpdateTodos = (id, arr, add, readField) => {
  let existingReference = { __ref: `Todo:${id}` }
  if (add) {
    return [existingReference, ...arr]
  } else {
    return arr.filter(ref => {
      return id !== readField('id', ref)
    })
  }
}

export default TodoList
