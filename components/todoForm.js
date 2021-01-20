import { Form } from 'formik'
import { Input, Button } from './index'
import capitalise from '../utils/capitalise'

const priorities = ['low', 'medium', 'high']

const AddTodoForm = ({ handleChange, values, errors }) => (
  <Form className='w-full'>
    <Input
      style={{ boxSizing: 'border-box' }}
      onChange={handleChange}
      name='text'
      label='Text'
      placeholder='Text'
      value={values.text}
    />
    <Input
      style={{ boxSizing: 'border-box' }}
      onChange={handleChange}
      label='Contact'
      name='contact'
      placeholder='Contact'
      value={values.contact}
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
      <Button bg='bg-green-300'>Go</Button>
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

export default AddTodoForm
