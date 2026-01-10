'use client'
import { useRouter } from 'next/navigation'
import { useUserData } from '@/hooks/userHook'
import Loader from '@/common/Loader'
import { useEffect, useState } from 'react'

export default function ProtectedRouteLogin({ children }: { children: React.ReactNode }) {
  const { userDataState, hasCheckedSession } = useUserData()
  const router = useRouter()
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    if (userDataState.loading || !hasCheckedSession) return;
    
    if (userDataState.data) {
      setIsRedirecting(true)
      if (userDataState.data.isAdmin) {
        router.replace('/admin')
      } else {
        router.replace('/user')
      }
    }
  }, [userDataState.loading, hasCheckedSession, userDataState.data, router])

  if (userDataState.loading || !hasCheckedSession) {
    return <Loader fallback={"Cargando autenticación en el sistema..."} />
  }

  if (isRedirecting || userDataState.data) {
    return <Loader fallback={"Redirigiendo..."} />
  }

  return <>{children}</>
}
