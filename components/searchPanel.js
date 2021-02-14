import { useQuery, useMutation } from '@apollo/client'
import { Loading, TodoList } from '../components/index'
import {
  AllTodos as ALLTODOS_QUERY,
  UpdateTodo as UPDATE_TODO
} from '../queries/index'

const SearchPanel = ({ olderThan, earlierThan, priority, title }) => {
  const [updateTodo] = useMutation(UPDATE_TODO)
  const { loading, error, data } = useQuery(ALLTODOS_QUERY, {
    fetchPolicy: 'cache-first',
    variables: { olderThan, earlierThan, priority }
  })
  if (loading || !data) return <Loading />
  if (error) return 'Error'
  return (
    <TodoList title={title} updateTodo={updateTodo} todos={data.allTodos} />
  )
}

export default SearchPanel
