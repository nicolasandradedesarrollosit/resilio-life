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
  const isRedirecting = useRef(false);

  console.log('[SessionChecker] State:', { 
    loading: userDataState.loading, 
    loaded: userDataState.loaded, 
    hasData: !!userDataState.data,
    isAdmin: userDataState.data?.isAdmin,
    pathname 
  });

  useEffect(() => {
    // <-- state loaded -->
    if (!userDataState.loading && userDataState.loaded && !isRedirecting.current) {
      // <-- redirections -->
      if (!userDataState.data) {
        if (pathname !== '/login') {
          console.log('[SessionChecker] No user data, redirecting to /login');
          isRedirecting.current = true;
          router.push('/login');
        }
      } else if (userDataState.data.isAdmin) {
        if (!pathname.startsWith('/admin')) {
          console.log('[SessionChecker] Admin user not on /admin, redirecting to /admin');
          isRedirecting.current = true;
          router.push('/admin');
        }
      } else {
        if (!pathname.startsWith('/user')) {
          console.log('[SessionChecker] Regular user not on /user, redirecting to /user');
          isRedirecting.current = true;
          router.push('/user');
        }
      }
    }
  }, [userDataState.loading, userDataState.loaded, userDataState.data, router, pathname]);

  // Reset redirect flag when pathname changes
  useEffect(() => {
    isRedirecting.current = false;
  }, [pathname]);

  // Mostrar loader solo durante la carga inicial
  if (userDataState.loading || !userDataState.loaded) {
    console.log('[SessionChecker] Still loading, showing auth loader');
    return <Loader fallback={"Cargando autenticación en el sistema..."}/>;
  }

  // Verificar si el usuario está en la ruta correcta
  const isInCorrectRoute = 
    (!userDataState.data && pathname === '/login') ||
    (userDataState.data?.isAdmin && pathname.startsWith('/admin')) ||
    (userDataState.data && !userDataState.data.isAdmin && pathname.startsWith('/user'));

  console.log('[SessionChecker] isInCorrectRoute:', isInCorrectRoute);

  // Mostrar loader solo si necesita redirigir
  if (!isInCorrectRoute) {
    console.log('[SessionChecker] Not in correct route, showing redirect loader');
    return <Loader fallback={"Redirigiendo..."}/>;
  }
  
  console.log('[SessionChecker] All good, rendering children');
  return <>{children}</>;
}