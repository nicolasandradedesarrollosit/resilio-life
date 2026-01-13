'use client'
import Loader from '@/common/Loader'
import { useUserData } from '@/hooks/useUserHook'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ProtectedRouteLogin({ children }: { children: React.ReactNode }) {
  const { userDataState } = useUserData()
  const router = useRouter()

  useEffect(() => {
    if (userDataState.loading || !userDataState.loaded) return;
    
    if (userDataState.data) {
      router.push(userDataState.data.isAdmin ? '/admin' : '/user');
    }
  }, [userDataState.loading, userDataState.loaded, userDataState.data, router])

  if (userDataState.loading || !userDataState.loaded || userDataState.data) {
    return <Loader fallback="Autenticando..."/>;
  }
  
  return <>{children}</>
}
