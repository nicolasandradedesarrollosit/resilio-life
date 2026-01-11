'use client'
import { usePathname, useRouter } from 'next/navigation'
import { useUserData } from '@/hooks/useAuthHook'
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
  useUserData(); // Cargar datos del usuario globalmente para evitar loaders en navegación
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
  const hasLoadedOnce = useRef(false);

  if (userDataState.loaded) {
    hasLoadedOnce.current = true;
  }

  useEffect(() => {
    // <-- state loaded -->
    if (!userDataState.loading && userDataState.loaded && !isRedirecting.current) {
      // <-- redirections -->
      if (!userDataState.data) {
        if (pathname !== '/login') {
          isRedirecting.current = true;
          router.push('/login');
        }
      } else if (userDataState.data.isAdmin) {
        if (!pathname.startsWith('/admin')) {
          isRedirecting.current = true;
          router.push('/admin');
        }
      } else {
        if (!pathname.startsWith('/user')) {
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

  // Mostrar loader solo durante la carga inicial del estado (SI NUNCA HA CARGADO)
  if (!hasLoadedOnce.current) {
    if (userDataState.loading && !userDataState.loaded) {
      return <Loader fallback={"Cargando autenticación en el sistema..."}/>;
    }

    if (!userDataState.loaded) {
      return <Loader fallback={"Verificando sesión..."}/>;
    }
  }

  // Verificar si el usuario está en la ruta correcta
  const isInCorrectRoute = 
    (!userDataState.data && pathname === '/login') ||
    (userDataState.data?.isAdmin && pathname.startsWith('/admin')) ||
    (userDataState.data && !userDataState.data.isAdmin && pathname.startsWith('/user'));

  // Si no está en la ruta correcta, retornamos null para evitar renderizar contenido protegido
  // mientras ocurre la redirección del useEffect.
  // Evitamos mostrar un Loader aquí para no generar "flicker" en transiciones rápidas.
  if (!isInCorrectRoute) {
    return null;
  }
  
  return <>{children}</>;
}