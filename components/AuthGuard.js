import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Dashboard({ children }) {
  const router = useRouter()

  useEffect(() => {
    // Check authentication
    const auth = document.cookie.includes('auth=loggedin')
    if (!auth && router.pathname !== '/login') {
      router.push('/login')
    }
  }, [router])

  return <>{children}</>
}
