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
    "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;

  const searchParams = req.nextUrl.searchParams.toString();
  const path = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ""}`;

  const session = await getToken({ req, secret: process.env.SECRET });
  // redirect if not logged in
  if (
    !session &&
    path !== "/login" &&
    path !== "/register" &&
    path !== "/forgot-password" &&
    !path.startsWith("/reset-password")
  ) {
    return NextResponse.redirect(new URL("/login", req.url));
    // if logged in, redirect away from login pages
  } else if (session && (path == "/login" || path == "/register")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // "/" to show /home content
  if (path === "/") return NextResponse.rewrite(new URL("/home", req.url));
}
