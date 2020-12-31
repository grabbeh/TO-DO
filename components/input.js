const Input = props => {
  const {
    label,
    type,
    placeholder,
    name,
    onChange,
    value,
    onFocus,
    onBlur,
    readOnly,
    autoComplete,
    completed,
    textSize
  } = props

  return (
    <div>
      {label && (
        <div className='mb-2'>
          <div className='text-bold text-xl'>
            <label htmlFor={value}>{label}</label>
          </div>
        </div>
      )}
      <input
        className={`${textSize} text-gray-900  focus:outline-none ${
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
