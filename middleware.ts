import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // <-- protect both /admin and /user routes -->
    if (pathname.startsWith('/admin') || pathname.startsWith('/user')) {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
            const cookies = request.headers.get('cookie') || '';
            
            console.log('[Middleware] Checking session for path:', pathname);
            console.log('[Middleware] API URL:', apiUrl);
            console.log('[Middleware] Has cookies:', !!cookies);

            const sessionCheck = await fetch(
                `${apiUrl}/api/check-session`,
                { 
                    method: 'GET',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Cookie': cookies,
                        // Pasar el origin para CORS
                        'Origin': request.nextUrl.origin,
                    },
                    // No usar credentials en server-side, pasamos cookies manualmente
                }
            );
            
            console.log('[Middleware] Session check response:', sessionCheck.status);
            
            // <-- if session is invalid, redirect to login -->
            if (!sessionCheck.ok) {
                console.log('[Middleware] Session invalid, redirecting to login');
                return NextResponse.redirect(new URL('/login', request.url));
            }

            const sessionData = await sessionCheck.json();
            console.log('[Middleware] Session data:', { loggedIn: sessionData.loggedIn, hasUser: !!sessionData.user });

            // <-- validate user exists -->
            if (!sessionData.user) {
                return NextResponse.redirect(new URL('/login', request.url));
            }

            // <-- admin route validation -->
            if (pathname.startsWith('/admin')) {
                if (!sessionData.user.isAdmin) {
                    return NextResponse.redirect(new URL('/user', request.url));
                }
            }

            // <-- user route validation -->
            if (pathname.startsWith('/user')) {
                if (sessionData.user.isAdmin) {
                    return NextResponse.redirect(new URL('/admin', request.url));
                }
            }

            return NextResponse.next();
        } catch (error) {
            console.error('[Middleware] Error checking session:', error);
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/user/:path*']
};
