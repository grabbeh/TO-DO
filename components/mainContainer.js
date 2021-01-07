import { Toaster } from 'react-hot-toast'

const Container = ({ children }) => (
  <div className='font:sans mb-5 flex justify-center'>
    <Toaster position='top-right' />
    <div className='px-3 md:px-0 h-full relative w-full md:w-2/5'>
      {children}
    </div>
  </div>
)

export default Container
