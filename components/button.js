const Button = ({ children, ...rest }) => (
  <button
    {...rest}
    type='submit'
    className='transition duration-500 ease-in-out bg-green-500 hover:bg-green-600 text-white rounded text-base px-4 py-1 flex-shrink-0'
  >
    {children.toUpperCase()}
  </button>
)

export default Button
