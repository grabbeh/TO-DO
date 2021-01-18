import { Toaster } from 'react-hot-toast'

const Container = ({ children }) => (
  <div className='bg-green-300 pb-5 h-full min-h-screen font:sans flex justify-center'>
    <Toaster position='top-right' />
    <div className='px-3 lg:px-0  relative w-full lg:w-2/5'>{children}</div>
  </div>
)

export default Container
