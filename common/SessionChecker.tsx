'use client'
import { usePathname, useRouter } from 'next/navigation'
import { useUserData } from '@/hooks/userHook'
import Loader from '@/common/Loader';
import { useEffect } from 'react';

const PUBLIC_ROUTES = [
  '/',
  '/contact',
];

const isPublicRoute = (pathname: string) => {
  return PUBLIC_ROUTES.some(route => pathname === route);
};

export default function SessionChecker({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  if (isPublicRoute(pathname)) {
    return <>{children}</>;
  }

  return <SessionCheckerAuth>{children}</SessionCheckerAuth>;
}

function SessionCheckerAuth({ children }: { children: React.ReactNode }) {
  const { userDataState } = useUserData();
  const router = useRouter();

  useEffect(() => {
    // Si terminó de cargar
    if (!userDataState.loading && userDataState.loaded) {
      if (!userDataState.data) {
        router.push('/login');
      } else if (userDataState.data.isAdmin) {
        router.push('/admin/home');
      } else {
        router.push('/user/home');
      }
    }
  }, [userDataState.loading, userDataState.loaded, userDataState.data, router]);

  if (userDataState.loading) {
    return <Loader fallback={"Cargando autenticación en el sistema..."}/>;
  }
  
  return <>{children}</>;
}