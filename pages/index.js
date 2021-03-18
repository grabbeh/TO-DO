import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Page () {
  const router = useRouter()
  useEffect(() => {
    router.push('/category/oldest')
  })

  return <p>Redirecting...</p>
}
