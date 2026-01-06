'use client'
import { useUserData } from '@/hooks/userHook'
import Loader from '@/common/Loader';

export default function SessionChecker({ children }: { children: React.ReactNode }) {
  const { userDataState } = useUserData();

  if (userDataState.loading) {
    return <Loader fallback={"Cargando autenticación en el sistema..."}/>
  }
  
  return children
}