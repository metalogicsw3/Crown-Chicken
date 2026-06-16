// middleware.js (root of project)
import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('firebase-token');
  const protectedRoutes = ['/account', '/checkout', '/cart'];

  const isProtected = protectedRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/account/:path*', '/checkout/:path*', '/cart/:path*'],
};