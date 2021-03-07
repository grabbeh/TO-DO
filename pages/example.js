import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex'
import 'react-reflex/styles.css'
const Example = () => (
  <ReflexContainer orientation='vertical'>
    <ReflexElement className='left-pane'>
      <div className='pane-content'>
        <label>Left Pane (resizable)</label>
      </div>
    </ReflexElement>

    <ReflexSplitter propagate={true} />

    <ReflexElement className='middle-pane' minSize='200' maxSize='800'>
      <div className='pane-content'>
        <label>
          Middle Pane (resizable)
          <br />
          <br />
          minSize = 200px
          <br />
          maxSize = 400px
        </label>
      </div>
    </ReflexElement>

    <ReflexSplitter propagate={true} />

    <ReflexElement className='right-pane'>
      <div className='pane-content'>
        <label>Right Pane (resizable)</label>
      </div>
    </ReflexElement>
  </ReflexContainer>
)

export default Example
