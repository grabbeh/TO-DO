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
    autoComplete
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
        className='focus:outline-none border-b-2 font-medium text-2xl'
        autoComplete={autoComplete}
        id={value}
        onChange={onChange}
        placeholder={placeholder}
        value={value}
        type={type}
        name={name}
        onFocus={onFocus}
        onBlur={onBlur}
        readOnly={readOnly}
        {...props}
      />
    </div>
  )
}

export default Input
