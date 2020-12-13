import withData from '../lib/withData'
import { compose } from 'recompose'
import { withApollo } from 'react-apollo'

const WithClient = compose(withData, withApollo)

export { WithClient }
