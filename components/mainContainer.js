import { Toaster } from 'react-hot-toast'

const Container = ({ children }) => (
  <div className='pb-5 bg-gray-100 h-full min-h-screen font:sans flex justify-center'>
    <Toaster
      position='top-right'
      toastOptions={{
        style: {
          background: '#363636',
          color: '#fff',
          zIndex: 1,
          minWidth: '200px'
        }
      }}
    />
    <div className='relative w-full md:w-3/5 lg:w-2/5'>{children}</div>
  </div>
)

export default Container
