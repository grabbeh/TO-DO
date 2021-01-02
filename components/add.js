import { DirectiveLocation } from 'graphql'
import Link from 'next/link'
import Button from './button'

const AddTodo = ({ id }) => (
  <div className='flex justify-end align-bottom'>
    <Button>
      <Link href={`/add-todo/${encodeURIComponent(id)}`}>
        <a className='mt-4 cursor-pointer font-bold'>Add</a>
      </Link>
    </Button>
  </div>
)

const Plus = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
    stroke='currentColor'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='2'
      d='M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z'
    />
  </svg>
)

export default AddTodo
