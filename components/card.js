const Card = ({ children, className }) => (
  <li className={`${className} bg-yellow-300 rounded-lg px-3 pt-3`}>
    {children}
  </li>
)

export default Card
