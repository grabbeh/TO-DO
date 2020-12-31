const Textarea = props => {
  const { type, placeholder, name, onChange, value } = props

  return (
    <textarea
      className='p-1 border-2 border-blue-500 h-40 text-gray-900 text-md font-medium w-full'
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
