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
  activeCommentsBarVar
} from '../../../../../lib/withApollo'
import { useRouter } from 'next/router'

const TodoPage = () => {
  const router = useRouter()
  const { category, todoId } = router.query
  let variables = {}
  variables[category] = true
  const todosResult = useQuery(ALLTODOS_QUERY, { variables })
  const commentsResult = useQuery(TODO_NOTES_QUERY, {
    variables: { id: todoId }
  })

  useEffect(() => {
    activeCommentsBarVar(true)
  })

  useEffect(() => {
    activeCategoryVar(category)
  })

  return (
    <div>
      <SplitPane split='vertical'>
        <Pane maxSize='35%' initialSize='20%' minSize='15%'>
          <TodoLists activeCategory={category} />
        </Pane>
        <Pane maxWidth='85%' minSize='25%'>
          <MainPanel result={todosResult} />
        </Pane>
        {commentsResult.loading && (
          <div className='w-1/4'>
            <Loading />
          </div>
        )}
        {commentsResult.data && (
          <Pane initialSize='25%'>
            <Comments todo={commentsResult.data.todo} />
          </Pane>
        )}
      </SplitPane>
    </div>
  )
}

const Apollo = withApollo({ ssr: true })(TodoPage)
export default Apollo
