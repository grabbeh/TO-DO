import { useRouter } from 'next/router'
import { Header } from './index'

const Back = ({ title }) => {
  const router = useRouter()
  return (
    <div className='flex align-middle'>
      <div
        className='mr-3 mt-4 cursor-pointer font-bold'
        onClick={() => router.back()}
      >
        <Arrow />
      </div>
      <Header>{title}</Header>
    </div>
  )
}

const Arrow = () => (
  <svg
    className='w-6 h-6'
    fill='none'
    stroke='currentColor'
    viewBox='0 0 24 24'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='2'
      d='M10 19l-7-7m0 0l7-7m-7 7h18'
    ></path>
  </svg>
)

export default Back
