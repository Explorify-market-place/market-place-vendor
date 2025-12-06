<<<<<<< HEAD
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import jwt from "jsonwebtoken";


const COOKIE_NAME = "auth_token";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes - keep as before plus any API endpoints that must be public
  const publicRoutes = ["/", "/auth/signin", "/auth/signup", "/market", "/api/plans", "/api/vendor/signup", "/api/vendor/signin"];
  if (publicRoutes.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Try NextAuth token first (if NextAuth is configured)
  try {
    const nextAuthToken = await getToken({ req: request, secret: process.env.AUTH_SECRET });
    if (nextAuthToken) {
      // nextAuthToken may contain role if configured
      request.nextauth = nextAuthToken as any;
    }
  } catch (e) {
    // ignore
  }

  // If no NextAuth session, try our JWT cookie
  let cookieTokenPayload: any = null;
  try {
    const cookie = request.cookies.get(COOKIE_NAME);
    if (cookie) {
      const secret = process.env.AUTH_SECRET;
      if (secret) {
        cookieTokenPayload = jwt.verify(cookie, secret) as any;
      }
    }
  } catch (e) {
    // invalid token -> ignore (treated as not-authenticated)
    cookieTokenPayload = null;
  }

  // If neither present, redirect to signin
  const userPayload = (request as any).nextauth ?? cookieTokenPayload;
  if (!userPayload) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/signin";
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  // Role-based protection
  if (pathname.startsWith("/vendor")) {
    const role = userPayload.role ?? (userPayload?.user?.role);
    if (role !== "vendor") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
  if (pathname.startsWith("/admin")) {
    const role = userPayload.role ?? (userPayload?.user?.role);
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/|.*\\..*).*)",
  ],
};
=======
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes
  const publicRoutes = ["/", "/auth/signin", "/market", "/api/plans"];
  if (publicRoutes.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const token = await getToken({ req: request, secret: process.env.AUTH_SECRET });

  // Require auth for everything else
  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/signin";
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  // Role-based protection
  if (pathname.startsWith("/vendor")) {
    if (token.role !== "vendor") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
  if (pathname.startsWith("/admin")) {
    if (token.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
      Match all routes except:
      - those starting with _next/ (Next.js internals)
      - those containing a dot (static files)
    */
    "/((?!_next/|.*\\..*).*)"
  ],
};


>>>>>>> 67c34c8c3324039ac4ec0cd00bb34da2653e93e1
