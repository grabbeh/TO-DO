const CardListItem = ({ children, className }) => (
  <li className={`${className} hover:bg-gray-100 pl-2 pr-4`}>{children}</li>
)

export default CardListItem
