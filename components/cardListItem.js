const CardListItem = ({ children, className }) => (
  <li className={`${className} border-b-2 bg-white px-2 py-1`}>{children}</li>
)

export default CardListItem
