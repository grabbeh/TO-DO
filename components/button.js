const Button = ({ children, ...rest }) => (
  <button
    {...rest}
    type='submit'
    className='transition duration-500 ease-in-out border-blue-500 border-2 bg-white hover:bg-blue-500 text-blue-500 hover:text-white rounded  text-xl px-5 py-1 font-bold flex-shrink-0'
  >
    {children}
  </button>
)

export default Button
