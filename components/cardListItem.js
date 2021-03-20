const CardListItem = ({ children, className }) => (
  <li className={`${className} bg-white hover:bg-gray-100 pl-2 pr-4 py-1`}>
    {children}
  </li>
)

export default CardListItem
