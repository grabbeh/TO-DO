const Container = ({ children }) => (
  <div className='px-2 md:px-0 font:sans mb-5 flex justify-center'>
    <div className='h-full relative w-full md:w-1/3'>{children}</div>
  </div>
)

export default Container
