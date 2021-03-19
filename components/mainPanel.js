import { Loading, TodoList, Subheader } from './index'
import { Menu } from './icons/index'
import { activeSideBarVar } from '../lib/withApollo'

const MainPanel = ({ todosLoading, todosData, category, fetchMore }) => (
  <div className='flex flex-col h-screen'>
    <div className='flex-grow-0'>
      <div
        className='cursor-pointer h-6 w-6 inline-block md:hidden'
        onClick={() => {
          activeSideBarVar(!activeSideBarVar())
        }}
      >
        <Menu />
      </div>
      <div className='p-3 border-b'>
        {todosData && (
          <Subheader>{category || todosData.todoList.name}</Subheader>
        )}
      </div>
    </div>
    {todosLoading || !todosData ? (
      <Loading />
    ) : (
      <div className='flex-grow overflow-y-hidden relative'>
        <div className='absolute inset-0 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-300 scrollbar-thumb-rounded'>
          <TodoList
            fetchMore={fetchMore}
            loading={todosLoading}
            todos={todosData.allTodos}
          />
        </div>
      </div>
    )}
  </div>
)

export default MainPanel
