const CardListItem = ({ children, className }) => (
  <li className={`${className} border-b-2 bg-white p-2`}>{children}</li>
)

export default CardListItem
