import { Toaster } from 'react-hot-toast'

const Container = ({ children }) => (
  <div className='bg-yellow-100 pb-5 font:sans flex justify-center'>
    <Toaster position='top-right' />
    <div className='px-3 lg:px-0 h-full relative w-full lg:w-2/5'>
      {children}
    </div>
  </div>
)

export default Container
