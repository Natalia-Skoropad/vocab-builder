import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { AUTH_COOKIE_NAME } from '@/lib/constants/api';
import { ROUTES } from '@/lib/constants/routes';

//===============================================================

const publicOnlyRoutes = [ROUTES.LOGIN, ROUTES.REGISTER];

const privateRoutes = [ROUTES.DICTIONARY, ROUTES.RECOMMEND, ROUTES.TRAINING];

//===============================================================

function matchesRoute(pathname: string, route: string) {
  return pathname === route || pathname.startsWith(`${route}/`);
}

//===============================================================

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  const isPublicOnlyRoute = publicOnlyRoutes.some((route) =>
    matchesRoute(pathname, route)
  );

  const isPrivateRoute = privateRoutes.some((route) =>
    matchesRoute(pathname, route)
  );

  if (isPublicOnlyRoute && token) {
    return NextResponse.redirect(new URL(ROUTES.DICTIONARY, request.url));
  }

  if (isPrivateRoute && !token) {
    return NextResponse.redirect(new URL(ROUTES.LOGIN, request.url));
  }

  return NextResponse.next();
}

//===============================================================

export const config = {
  matcher: [
    '/login',
    '/register',
    '/dictionary/:path*',
    '/recommend/:path*',
    '/training/:path*',
  ],
};
