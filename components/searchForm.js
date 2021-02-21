import { Formik, Form } from 'formik'
import capitalise from '../utils/capitalise'
import { Subheader, Input, Button } from './index'

const SearchForm = ({ getTodos }) => (
  <div className='sticky md:h-screen h-full w-full md:w-48 top-0 bg-green-300 p-2'>
    <Subheader>Filter</Subheader>
    <SearchInput getTodos={getTodos} />
    <div
      className='cursor-pointer'
      onClick={() => {
        getTodos()
      }}
    >
      Reset
    </div>
  </div>
)

const SearchInput = ({ getTodos }) => (
  <Formik
    initialValues={{
      priority: '',
      olderThan: '',
      earlierThan: ''
    }}
    validateOnChange={false}
    onSubmit={(values, { setErrors }) => {
      setErrors({
        olderThan: false,
        earlierThan: false,
        priority: false
      })
      let { earlierThan, olderThan, priority } = values
      let variables
      if (earlierThan) {
        variables = {
          earlierThan
        }
      }
      if (olderThan) {
        variables = {
          olderThan
        }
      }
      if (priority) {
        variables = {
          ...variables,
          priority
        }
      }
      getTodos({ variables })
    }}
  >
    {props => {
      return <SearchInputs {...props} />
    }}
  </Formik>
)

export default SearchForm

const priorities = ['low', 'medium', 'high']

const SearchInputs = ({ handleChange, values, errors }) => (
  <Form className='w-full'>
    <Input
      style={{ boxSizing: 'border-box' }}
      onChange={handleChange}
      name='olderThan'
      type='number'
      label='Older than'
      placeholder='Older than'
      value={values.olderThan}
    />
    <Input
      style={{ boxSizing: 'border-box' }}
      onChange={handleChange}
      label='Earlier than'
      type='number'
      name='earlierThan'
      placeholder='Earlier than'
      value={values.earlierThan}
    />
    <div className='text-md font-bold'>Priority</div>
    <div role='group'>
      {priorities.map((priority, i) => (
        <label key={i} className='inline-flex items-center'>
          <input
            checked={values.priority === priority}
            type='radio'
            name='priority'
            onChange={handleChange}
            value={priority}
          />
          <span className='font-semibold text-xl mx-2'>
            {capitalise(priority)}
          </span>
        </label>
      ))}
    </div>
    <div className='mt-3 flex justify-end'>
      <Button>Go</Button>
    </div>

    <div className='mt-1'>
      {
        <div>
          <div>{errors.text || errors.serverError}</div>
        </div>
      }
    </div>
  </Form>
)
