import slugify from 'slugify'

const Input = props => {
  const { label, type, placeholder, name, onChange, value } = props

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
        className='w-full font-medium text-xl outline-none focus:border-blue-500 border-gray-300 border-2 p-2 rounded'
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
