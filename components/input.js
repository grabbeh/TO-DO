import { Field } from 'formik'

const Input = props => {
  const {
    label,
    type,
    placeholder,
    name,
    onChange,
    value,
    completed,
    textSize
  } = props

  return (
    <div className='my-3'>
      {label && (
        <div>
          <div className='font-bold text-md'>
            <label htmlFor={value}>{label}</label>
          </div>
        </div>
      )}
      <input
        className={`${textSize} ${
          completed ? 'line-through' : ''
        } font-medium w-full`}
        id={value}
        onChange={onChange}
        placeholder={placeholder}
        value={value}
        type={type}
        name={name}
      />
    </div>
  )
}

export default Input
