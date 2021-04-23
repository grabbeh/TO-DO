import { useQuery } from '@apollo/client'
import { useEffect } from 'react'
import SplitPane from 'react-split-pane'
import Pane from 'react-split-pane/lib/Pane'
import { TodoLists, MainPanel } from '../../../components/index'
import { AllTodos as ALLTODOS_QUERY } from '../../../queries/index'
import withApollo, { activeCategoryVar } from '../../../lib/withApollo'
import { useRouter } from 'next/router'
import useLocalStorage from '../../../hooks/useLocalStorage'

const TodoPage = () => {
  const router = useRouter()
  const [firstPane, setFirstPane] = useLocalStorage('firstPane')
  const [secondPane, setSecondPane] = useLocalStorage('secondPane')
  const { category } = router.query
  let variables = {}
  variables[category] = true
  const result = useQuery(ALLTODOS_QUERY, { variables })

  useEffect(() => {
    activeCategoryVar(category)
  }, [])

  useEffect(() => {
    console.log(firstPane)
    if (!firstPane) {
      setFirstPane('20%')
    }
  }, [])

  useEffect(() => {
    console.log(secondPane)
    if (!secondPane) {
      setSecondPane('80%')
    }
  }, [])

  return (
    <SplitPane split='vertical'>
      <Pane
        onChange={size => {
          console.log('Called')
          setFirstPane(size)
        }}
        maxSize='35%'
        initialSize={firstPane}
        minSize='15%'
      >
        <TodoLists />
      </Pane>
      <Pane
        onChange={size => setSecondPane(size)}
        maxWidth='85%'
        initialSize={secondPane}
        minSize='25%'
      >
        <MainPanel result={result} />
      </Pane>
    </SplitPane>
  )
}

const Apollo = withApollo({ ssr: true })(TodoPage)
export default Apollo
