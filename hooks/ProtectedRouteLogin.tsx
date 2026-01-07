'use client'
import { useRouter } from 'next/navigation'
import { useUserData } from '@/hooks/userHook'
import Loader from '@/common/Loader'
import { useEffect } from 'react'

export default function ProtectedRouteLogin({ children }: { children: React.ReactNode }) {
  const { userDataState } = useUserData()
  const router = useRouter()

  useEffect(() => {
    // Si terminó de cargar y el usuario está logueado, redirigir
    if (!userDataState.loading && userDataState.loaded) {
      if (userDataState.data) {
        // Usuario logueado - redirigir según su rol
        if (userDataState.data.isAdmin) {
          router.push('/admin/home')
        } else {
          router.push('/user/home')
        }
      }
      // Si no hay datos, dejar que vea el login
    }
  }, [userDataState.loading, userDataState.loaded, userDataState.data, router])

  // Solo mostrar loader si está cargando Y no hay datos previos cargados
  if (userDataState.loading && !userDataState.loaded) {
    return <Loader fallback={"Cargando autenticación en el sistema..."} />
  }

  // Si hay usuario logueado, no mostrar nada (el redirect está en el useEffect)
  if (userDataState.data) {
    return null
  }

  // Si no hay usuario, mostrar el contenido (login)
  return <>{children}</>
}
