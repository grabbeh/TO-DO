import { Form } from 'formik'
import { Input, Button } from '../components/index'

const TodolistForm = ({ handleChange, values, errors }) => (
  <Form>
    <Input
      style={{ boxSizing: 'border-box' }}
      onChange={handleChange}
      name='name'
      value={values.name}
    />
    <div className='mt-3 flex justify-end'>
      <Button>Go</Button>
    </div>
    <div className='mt-1'>
      {
        <div>
          <div>{errors.name || errors.serverError}</div>
        </div>
      }
    </div>
  </Form>
)

export default TodolistForm