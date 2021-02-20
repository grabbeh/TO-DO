import Link from 'next/link'
import { Header, CardListItem as Card, TodoListOptionsBox } from './index'

const TodoLists = ({ todoLists }) => {
  return (
    <div className='bg-blue-500'>
      <Header>Lists</Header>
      <ul>
        {todoLists.map(todoList => (
          <TodoList key={todoList.id} todoList={todoList} />
        ))}
      </ul>
    </div>
  )
}

const TodoList = ({ todoList }) => (
  <React.Fragment>
    {!todoList.deleted && (
      <div className='p-2' key={todoList.id}>
        <div className='flex'>
          <div className='flex-grow'>
            <div className='flex justify-between'>
              <Link href={`/todos/${encodeURIComponent(todoList.id)}`}>
                <span className='cursor-pointer flex font-semibold text-gray-900 text-xl'>
                  {todoList.name}
                </span>
              </Link>
              <div className='flex'>
                <div className='leading-8 px-2 text-sm text-right font-semibold rounded bg-blue-100 text-blue-700'>
                  {todoList.activeTodosVolume}
                </div>
                <div>
                  <TodoListOptionsBox todoList={todoList} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
  </React.Fragment>
)

export default TodoLists
