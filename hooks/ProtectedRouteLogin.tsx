'use client'
import Loader from '@/common/Loader'
import { useUserData } from '@/hooks/userHook'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ProtectedRouteLogin({ children, hasAuthCookie = false }: { children: React.ReactNode, hasAuthCookie?: boolean }) {
  const { userDataState } = useUserData()
  const router = useRouter()
  
  // Use prop if available, otherwise just false to be safe (or rely on effect)
  // We prefer prop to avoid hydration mismatch
  const isOptimisticAuth = hasAuthCookie;

  useEffect(() => {
    if (userDataState.loading || !userDataState.loaded) return;
    
    if (userDataState.data) {
      if (userDataState.data.isAdmin) {
        router.push('/admin');
      } else {
        router.push('/user');
      }
    }
  }, [userDataState.loading, userDataState.loaded, userDataState.data, router])

  if (userDataState.loading || !userDataState.loaded || userDataState.data) {
    return <Loader fallback={"Verificando estado de la sesión..."} />
  }

  if (isOptimisticAuth) {
      return <Loader fallback={"Redirigiendo..."} />
  }
  
  return <>{children}</>
}
