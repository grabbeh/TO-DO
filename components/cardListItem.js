const CardListItem = ({ children, className }) => (
  <li
    className={`${className} rounded-lg hover:bg-gray-100 border pl-2 my-3 pr-4`}
  >
    {children}
  </li>
)

export default CardListItem
