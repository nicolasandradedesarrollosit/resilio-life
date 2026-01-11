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
  const pathname = usePathname();
  const hasRedirected = useRef(false);

  useEffect(() => {
    // <-- state loaded -->
    if (!userDataState.loading && userDataState.loaded) {
      // Evitar redirecciones repetidas
      if (hasRedirected.current) return;
      
      // <-- redirections -->
      if (!userDataState.data) {
        if (pathname !== '/login') {
          hasRedirected.current = true;
          router.push('/login');
        }
      } else if (userDataState.data.isAdmin) {
        if (!pathname.startsWith('/admin')) {
          hasRedirected.current = true;
          router.push('/admin');
        }
      } else {
        if (!pathname.startsWith('/user')) {
          hasRedirected.current = true;
          router.push('/user');
        }
      }
    }
  }, [userDataState.loading, userDataState.loaded, userDataState.data, router, pathname]);

  // Mostrar loader solo durante la carga inicial
  if (userDataState.loading || !userDataState.loaded) {
    return <Loader fallback={"Cargando autenticación en el sistema..."}/>;
  }

  // Mostrar loader durante la redirección
  const shouldRedirect = 
    (!userDataState.data && pathname !== '/login') ||
    (userDataState.data?.isAdmin && !pathname.startsWith('/admin')) ||
    (userDataState.data && !userDataState.data.isAdmin && !pathname.startsWith('/user'));

  if (shouldRedirect) {
    return <Loader fallback={"Redirigiendo..."}/>;
  }
  
  return <>{children}</>;
}