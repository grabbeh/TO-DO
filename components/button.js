const Button = ({ children, bg = 'bg-white', ...rest }) => (
  <button
    {...rest}
    type='submit'
    className={`${bg} rounded bg-white text-xl px-5 py-1 font-bold flex-shrink-0`}
  >
    {children}
  </button>
)

export default Button
