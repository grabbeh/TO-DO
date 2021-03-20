import { useQuery } from '@apollo/client'
import { Loading, TodoList, Subheader } from './index'
import { Menu } from './icons/index'
import { activeSideBarVar } from '../lib/withApollo'
import { ActiveCategory as ACTIVE_CATEGORY } from '../queries/index'

const MainPanel = ({ result }) => {
  const {
    data: { activeCategory }
  } = useQuery(ACTIVE_CATEGORY, { fetchPolicy: 'cache-only' })

  return (
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
          {result.data && <Subheader>{activeCategory}</Subheader>}
        </div>
      </div>
      {result.loading || !result.data ? (
        <Loading />
      ) : (
        <div className='flex-grow overflow-y-hidden relative'>
          <div className='absolute inset-0 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-200 scrollbar-thumb-rounded'>
            <TodoList
              fetchMore={result.fetchMore}
              loading={result.loading}
              todos={result.data.allTodos}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default MainPanel
