import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // <-- protect both /admin and /user routes -->
    if (pathname.startsWith('/admin') || pathname.startsWith('/user')) {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

            const sessionCheck = await fetch(
                `${apiUrl}/api/check-session`,
                { 
                    headers: { 
                        cookie: request.headers.get('cookie') || '' 
                    },
                    credentials: 'include'
                }
            );
            
            // <-- if session is invalid, redirect to login -->
            if (!sessionCheck.ok) {
                return NextResponse.redirect(new URL('/login', request.url));
            }

            const sessionData = await sessionCheck.json();

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
            console.error('Middleware error checking session:', error);
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/user/:path*']
};
