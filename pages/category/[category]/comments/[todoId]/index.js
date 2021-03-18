import { useLazyQuery, useQuery } from '@apollo/client'
import { useEffect } from 'react'
import SplitPane from 'react-split-pane'
import Pane from 'react-split-pane/lib/Pane'
import {
  Loading,
  TodoLists,
  Comments,
  MainPanel
} from '../../../../../components/index'
import {
  AllTodos as ALLTODOS_QUERY,
  TodoNotes as TODO_NOTES_QUERY
} from '../../../../../queries/index'
import withApollo, {
  activeCategoryVar,
  activeTodoVar,
  activeCommentsBarVar
} from '../../../../../lib/withApollo'
import { useRouter } from 'next/router'

const TodoPage = () => {
  const router = useRouter()
  const { category, todoId } = router.query
  let variables = {}
  variables[category] = true
  const {
    loading: todosLoading,
    error: todosError,
    data: todosData,
    fetchMore
  } = useQuery(ALLTODOS_QUERY, { variables })

  const {
    loading: commentsLoading,
    error: commentsError,
    data: commentsData
  } = useQuery(TODO_NOTES_QUERY, { variables: { id: todoId } })

  useEffect(() => {
    if (todosData) {
      activeCategoryVar(category)
    }
  }, [todosData])

  useEffect(() => {
    if (commentsData) {
      activeTodoVar(commentsData.todo)
    }
  }, [commentsData])

  useEffect(() => {
    activeCommentsBarVar(true)
  })

  return (
    <div>
      <SplitPane split='vertical'>
        <Pane maxSize='35%' initialSize='20%' minSize='15%'>
          <TodoLists />
        </Pane>
        <Pane maxWidth='85%' minSize='25%'>
          <MainPanel
            todosLoading={todosLoading}
            todosData={todosData}
            fetchMore={fetchMore}
          />
        </Pane>
        {commentsLoading && (
          <div className='w-1/4'>
            <Loading />
          </div>
        )}
        {commentsData && (
          <Pane initialSize='25%'>
            <Comments todo={commentsData.todo} />
          </Pane>
        )}
      </SplitPane>
    </div>
  )
}

const Apollo = withApollo({ ssr: true })(TodoPage)
export default Apollo
