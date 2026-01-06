import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (pathname.startsWith('/admin')) {
        try {
            const protocol = request.headers.get('x-forwarded-proto') || 'http';
            const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'localhost:3000';
            const origin = `${protocol}://${host}`;

            const sessionCheck = await fetch(
                `${origin}/api/check-session`,
                { 
                    headers: { 
                        cookie: request.headers.get('cookie') || '' 
                    },
                    credentials: 'include'
                }
            );

            if (!sessionCheck.ok) {
                return NextResponse.redirect(new URL('/login', request.url));
            }

            const sessionData = await sessionCheck.json();

            if (!sessionData.user?.isAdmin) {
                return NextResponse.redirect(new URL('/home/user', request.url));
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
    matcher: ['/admin/:path*']
};
