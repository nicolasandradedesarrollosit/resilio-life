'use client'
import Loader from '@/common/Loader'
import { useUserData } from '@/hooks/userHook'
import { useEffect } from 'react'

export default function ProtectedRouteLogin({ children, hasAuthCookie = false }: { children: React.ReactNode, hasAuthCookie?: boolean }) {
  const { userDataState } = useUserData()
  
  // Use prop if available, otherwise just false to be safe (or rely on effect)
  // We prefer prop to avoid hydration mismatch
  const isOptimisticAuth = hasAuthCookie;

  useEffect(() => {
    if (userDataState.loading || !userDataState.loaded) return;
    
    if (userDataState.data) {
      if (userDataState.data.isAdmin) {
        window.location.href = '/admin';
      } else {
        window.location.href = '/user';
      }
    }
  }, [userDataState.loading, userDataState.loaded, userDataState.data])

  if (userDataState.loading || !userDataState.loaded || userDataState.data) {
    return <Loader fallback={"Verificando estado de la sesión..."} />
  }

  // If cookie says we are logged in, don't show login form, show loader waiting for redirect
  if (isOptimisticAuth) {
      return <Loader fallback={"Redirigiendo..."} />
  }
  
  return <>{children}</>
}
