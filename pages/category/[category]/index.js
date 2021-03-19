import { useQuery } from '@apollo/client'
import { useEffect } from 'react'
import SplitPane from 'react-split-pane'
import Pane from 'react-split-pane/lib/Pane'
import { TodoLists, MainPanel } from '../../../components/index'
import { AllTodos as ALLTODOS_QUERY } from '../../../queries/index'
import withApollo, { activeCategoryVar } from '../../../lib/withApollo'
import { useRouter } from 'next/router'

const TodoPage = () => {
  const router = useRouter()
  const { category } = router.query
  let variables = {}
  variables[category] = true
  const result = useQuery(ALLTODOS_QUERY, { variables })

  return (
    <SplitPane split='vertical'>
      <Pane maxSize='35%' initialSize='20%' minSize='15%'>
        <TodoLists activeCategory={category} />
      </Pane>
      <Pane maxWidth='85%' minSize='25%'>
        <MainPanel result={result} category={category} />
      </Pane>
    </SplitPane>
  )
}

const Apollo = withApollo({ ssr: true })(TodoPage)
export default Apollo
