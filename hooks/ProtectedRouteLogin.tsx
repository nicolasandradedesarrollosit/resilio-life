'use client'
import { useRouter } from 'next/navigation'
import { useUserData } from '@/hooks/userHook'
import Loader from '@/common/Loader'
import { useEffect, useState } from 'react'

export default function ProtectedRouteLogin({ children }: { children: React.ReactNode }) {
  const { userDataState } = useUserData()
  const router = useRouter()
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    if (userDataState.loading || !userDataState.loaded) return;
    
    if (userDataState.data) {
      setIsRedirecting(true)
      if (userDataState.data.isAdmin) {
        router.replace('/admin')
      } else {
        router.replace('/user')
      }
    }
  }, [userDataState.loading, userDataState.loaded, userDataState.data, router])

  if (userDataState.loading || !userDataState.loaded) {
    return <Loader fallback={"Cargando autenticación en el sistema..."} />
  }

  if (isRedirecting || userDataState.data) {
    return <Loader fallback={"Redirigiendo..."} />
  }

  return <>{children}</>
}
