import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-this'
);

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // List of public routes that don't need authentication
  const publicRoutes = ['/login', '/register', '/forgot-password'];

  // Check if the route is public
  if (publicRoutes.includes(pathname)) {
    // If user is already authenticated, redirect to dashboard
    const token = request.cookies.get('auth_token')?.value;
    if (token) {
      try {
        await jwtVerify(token, secret);
        return NextResponse.redirect(new URL('/admin', request.url));
      } catch {
        // Token is invalid, allow access to login
        return NextResponse.next();
      }
    }
    return NextResponse.next();
  }

  // For protected routes, verify JWT token
  const token = request.cookies.get('auth_token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const decoded = await jwtVerify(token, secret);
    const user = decoded.payload as any;
    const role = user.role as string;

    // Role-based route protection
    if (pathname.startsWith('/admin') && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    if (pathname.startsWith('/doctor') && role !== 'DOCTOR') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    if (pathname.startsWith('/nurse') && role !== 'NURSE') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    if (pathname.startsWith('/receptionist') && role !== 'RECEPTIONIST') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    // Token is valid, allow access
    return NextResponse.next();
  } catch {
    // Token is invalid or expired
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
