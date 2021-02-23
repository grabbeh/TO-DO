const Tab = props => {
  return (
    <div
      className={`${
        !!props.isactive ? 'font-semibold' : ''
      }  text-gray-900 cursor-pointer text-xl mr-3`}
      {...props}
      onClick={props.isDisabled ? null : props.onSelect}
    >
      {props.children}
    </div>
  )
}

export default Tab
