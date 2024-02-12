import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    "/((?!_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;

  const searchParams = req.nextUrl.searchParams.toString();
  const path = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ""}`;

  const session = (await getToken({ req, secret: process.env.SECRET })) as any;

  if (path.startsWith("/api/auth")) {
    return NextResponse.next();
  } else if (session && path.startsWith("/api")) {
    return NextResponse.next();
  }
  // List of paths accessible without authentication
  const openPaths = ["/login", "/register", "/forgot-password", "/reset-password", "/verify-email", "/accept-invite"];

  // Redirect unauthenticated users away from protected paths
  if (!session && !openPaths.some((openPath) => path.startsWith(openPath))) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (session && (path.startsWith("/login") || path.startsWith("/register"))) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // if (path === "/team" && session?.user?.role !== "admin" && !session?.user?.teamId) {
  //   return NextResponse.redirect(new URL("/", req.url));
  // }

  // "/" to show /home content
  if (path === "/") return NextResponse.rewrite(new URL("/home", req.url));

  return NextResponse.next();
}
