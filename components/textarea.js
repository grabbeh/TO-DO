const Textarea = props => {
  const { type, placeholder, name, onChange, value } = props

  return (
    <textarea
      className='p-1 outline-black h-40 text-gray-900 text-md font-medium w-full'
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
