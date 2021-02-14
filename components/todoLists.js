import Link from 'next/link'
import { Header, CardListItem as Card, TodoListOptionsBox } from './index'

const TodoLists = ({ todoLists }) => {
  return (
    <div>
      <Header>Lists</Header>
      <ul className='border-t-2 md:border-l-2 md:border-r-2'>
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
      <Card key={todoList.id}>
        <div className='flex'>
          <div className='flex-grow'>
            <div className='flex justify-between'>
              <Link href={`/todos/${encodeURIComponent(todoList.id)}`}>
                <span className='cursor-pointer flex font-semibold text-gray-900 text-xl'>
                  {todoList.name}
                </span>
              </Link>
              <div className='leading-8 px-2 text-sm text-right font-semibold rounded bg-blue-100 text-blue-700'>
                {todoList.activeTodosVolume}
              </div>
            </div>
            <div className='mt-2 mb-1'>
              <TodoListOptionsBox todoList={todoList} />
            </div>
          </div>
        </div>
      </Card>
    )}
  </React.Fragment>
)

export default TodoLists
