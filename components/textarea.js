const Textarea = props => {
  const { type, placeholder, name, onChange, value } = props

  return (
    <textarea
      className='p-1 text-gray-900 text-xs font-medium w-full'
      id={value}
      onChange={onChange}
      placeholder={placeholder}
      value={value}
      type={type}
      name={name}
    />
  )
}

export default Textarea
