import { NextRequest, NextResponse } from 'next/server';

// NOTA: Desactivamos la verificación server-side porque:
// 1. El SessionChecker del cliente ya maneja toda la lógica de autenticación
// 2. Las cookies cross-site desde Vercel Edge Functions causan problemas de CORS
// 3. La duplicación de verificaciones causa race conditions

export async function middleware(request: NextRequest) {
    // Simplemente dejamos pasar todas las requests
    // La autenticación se maneja completamente en el cliente con SessionChecker
    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/user/:path*']
};
