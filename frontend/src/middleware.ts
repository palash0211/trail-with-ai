import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Public paths that don't require authentication
  const publicPaths = ['/welcome', '/api/auth/login', '/api/auth/register'];
  
  // Check for authentication (token)
  const token = request.cookies.get('accessToken')?.value;
  const isAuthenticated = !!token;
  
  // If path is protected and not authenticated, redirect to welcome page
  if (!publicPaths.includes(pathname) && !isAuthenticated) {
    return NextResponse.redirect(new URL('/welcome', request.url));
  }
  
  // If authenticated and trying to access welcome page, redirect to home
  if (isAuthenticated && pathname === '/welcome') {
    return NextResponse.redirect(new URL('/home', request.url));
  }
  
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
