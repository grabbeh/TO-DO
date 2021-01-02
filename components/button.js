const Button = ({ children }) => (
  <button
    type='submit'
    className='bg-green-500 rounded text-white text-md px-4 py-1 font-bold flex-shrink-0'
  >
    {children}
  </button>
)

export default Button
