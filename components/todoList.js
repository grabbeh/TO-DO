import { useMutation } from '@apollo/client'
import { CardListItem as Card, Subheader, TodoOptionsBox } from './index'
import Link from 'next/link'
import { Comments } from './icons/index'
import { UpdateTodo as UPDATE_TODO } from '../queries/index'
import activateToast from '../utils/toast'

const TodoList = ({ todos, title, updateTodo }) => (
  <div>
    {title && <Subheader>{title}</Subheader>}
    <ul className='mb-3'>
      {todos.map(todo => (
        <Todo key={todo.id} updateTodo={updateTodo} todo={todo} />
      ))}
    </ul>
  </div>
)

const Todo = ({ todo }) => {
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
            if (updateTodo.completed) {
              return [ref, ...existing]
            } else {
              return existing.filter(ref => {
                return todo.id !== readField('id', ref)
              })
            }
          },
          activeTodos (existing, { readField }) {
            if (!updateTodo.completed) {
              return [ref, ...existing]
            } else {
              return existing.filter(ref => {
                return todo.id !== readField('id', ref)
              })
            }
          },
          completedTodosVolume (value) {
            if (updateTodo.completed) {
              value++
            } else {
              value--
            }
            return value
          },
          activeTodosVolume (value) {
            if (!updateTodo.completed) {
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
      <div className='ml-8 text-gray-400'>{todo.todoListName}</div>
      <div className='flex'>
        <div>
          <label>
            <input
              type='checkbox'
              checked={todo.completed}
              onChange={() => {
                let mutation = updateCompletionStatus({
                  variables: {
                    todo: { ...todo, completed: !todo.completed }
                  },
                  optimisticResponse: {
                    type: 'Mutation',
                    updateTodo: { ...todo, completed: !todo.completed }
                  }
                })
                activateToast(mutation, 'Todo updated')
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
                  todo.completed ? 'line-through' : ''
                } flex font-semibold text-gray-900 text-xl`}
              >
                {todo.text}
              </span>
              <div className='text-gray-500 text-lg'>{todo.contact}</div>
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
          <div className='flex self-end mt-2'>
            <div className='align-bottom justify-between flex-grow flex'>
              <TodoOptionsBox todo={todo} />
              <div>
                <div className='cursor-pointer'>
                  <Link href={`/notes/${encodeURIComponent(todo.id)}`}>
                    <a>
                      <div className='flex hover:text-blue-800 text-blue-500'>
                        <div className='h-5 w-5'>
                          <Comments />
                        </div>
                        <div className=' ml-1 text-md font-bold'>
                          {todo.commentsCount}
                        </div>
                      </div>
                    </a>
                  </Link>
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
  if (updateTodo && !updateTodo.completed) {
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
