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
  // Get the pathname of the request (e.g. /, /about, /blog/first-post)
  const path = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ""}`;

  // redirect to login page if no auth
  const session = await getToken({ req });
  if (!session && path !== "/login" && path !== "/register") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // rewrite root application to `/home` folder
  if (path == "/") {
    return NextResponse.rewrite(new URL(`/home${path === "/" ? "" : path}`, req.url));
  }
}
