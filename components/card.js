const Card = ({ children, className }) => (
  <li className={`${className} bg-white rounded-lg p-2`}>{children}</li>
)

export default Card
