const Textarea = props => {
  const { type, placeholder, name, onChange, value } = props

  return (
    <textarea
      className='w-full font-medium text-xl outline-none focus:border-blue-500 border-gray-300 border-2 p-2 rounded'
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
