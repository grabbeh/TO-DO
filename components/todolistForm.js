import { Form } from 'formik'
import { Input, Button } from '../components/index'

const TodolistForm = ({ setFieldValue, handleChange, values, errors }) => {
  return (
    <Form>
      <Input
        style={{ boxSizing: 'border-box' }}
        onChange={e => {
          let val = e.target.value.replace(/\W+/g, '-').toLowerCase()
          setFieldValue('name', val)
        }}
        name='name'
        label='Name'
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
}

export default TodolistForm
