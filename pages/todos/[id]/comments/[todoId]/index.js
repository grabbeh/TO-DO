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
  const { id, todoId } = router.query
  const {
    loading: todosLoading,
    error: todosError,
    data: todosData,
    fetchMore
  } = useQuery(ALLTODOS_QUERY, { variables: { id } })

  const {
    loading: commentsLoading,
    error: commentsError,
    data: commentsData
  } = useQuery(TODO_NOTES_QUERY, { variables: { id: todoId } })

  useEffect(() => {
    activeCommentsBarVar(true)
  })

  return (
    <div>
      <SplitPane split='vertical'>
        <Pane maxSize='35%' initialSize='20%' minSize='15%'>
          <TodoLists activeCategory={todosData.todoList.name} />
        </Pane>
        <Pane maxWidth='85%' minSize='25%'>
          <MainPanel
            todosLoading={todosLoading}
            todosData={todosData}
            fetchMore={fetchMore}
          />
        </Pane>

        <Pane initialSize='25%'>
          {commentsData ? <Comments todo={commentsData.todo} /> : <Loading />}
        </Pane>
      </SplitPane>
    </div>
  )
}

const Apollo = withApollo({ ssr: true })(TodoPage)
export default Apollo
