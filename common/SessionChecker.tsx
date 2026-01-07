'use client'
import { usePathname, useRouter } from 'next/navigation'
import { useUserData } from '@/hooks/userHook'
import Loader from '@/common/Loader';
import { useEffect, useRef } from 'react';

const PUBLIC_ROUTES = [
  '/',
  '/contact',
  '/login',
  '/register',
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
  const isFirstRender = useRef(true);

  useEffect(() => {
    // <-- state loaded -->
    if (!userDataState.loading && userDataState.loaded) {
      isFirstRender.current = false;
      // <-- redirections -->
      if (!userDataState.data) {
        router.push('/login');
      } else if (userDataState.data.isAdmin) {
        router.push('/admin');
      } else {
        router.push('/user');
      }
    }
  }, [userDataState.loading, userDataState.loaded, userDataState.data, router]);

  if (userDataState.loading && !userDataState.loaded && isFirstRender.current) {
    return <Loader fallback={"Cargando autenticación en el sistema..."}/>;
  }
  
  return <>{children}</>;
}