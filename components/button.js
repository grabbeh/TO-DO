const Button = ({ children, ...rest }) => (
  <button
    {...rest}
    type='submit'
    className='transition duration-500 ease-in-out bg-blue-600 hover:bg-blue-500 text-white rounded  text-base px-4 py-1 font-semibold flex-shrink-0'
  >
    {children}
  </button>
)

export default Button
