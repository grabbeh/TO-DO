const Card = ({ children, className }) => (
  <div className={`${className} bg-white rounded-lg  py=2 pl-2 pr-4`}>
    {children}
  </div>
)

export default Card
