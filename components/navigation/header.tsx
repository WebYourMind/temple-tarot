"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "components/ui/button";
import { Sidebar } from "./sidebar";
import { SidebarList } from "components/navigation/sidebar-list";
import { useSession } from "next-auth/react";
// import appConfig from "app.config";
import { useTheme } from "next-themes";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "lib/utils";
import LogoComponent from "./logo-component";
// import { MagicFont } from "components/tarot-session/query/query-input";

export default function Header() {
  const { data: session, status, update } = useSession() as any;
  const { setTheme, resolvedTheme } = useTheme();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [isScrolled, setIsScrolled] = useState(false);

  const createAuthUrl = (path: string) => {
    const currentPath = searchParams.get("redirect") || "/";
    return `${path}?redirect=${encodeURIComponent(currentPath)}`;
  };

  const registerUrl = createAuthUrl("/register");
  const loginUrl = createAuthUrl("/login");

  const handleTarotClick = (e) => {
    update();
    if (pathname === "/") {
      e.preventDefault();
      window.location.reload();
    } else {
      router.push("/");
    }
  };

  return (
    <header className={cn("z-50 flex w-full shrink-0 items-center justify-between p-3")}>
      <>
        <div className="flex w-full items-center justify-between">
          <Link href="/" className="mr-2 hover:no-underline">
            {/* <h3 className={cn("mt-0 text-lg text-foreground", MagicFont.className)}>{appConfig.appName}</h3> */}
            <LogoComponent />
          </Link>
          {status !== "loading" && (
            <div className="flex items-center">
              {!session?.user && (
                <>
                  <Button variant="link" asChild className="-ml-2">
                    <Link href={loginUrl}>Login</Link>
                  </Button>

                  <Button variant="link" asChild className="-ml-2">
                    <Link href={registerUrl}>Register</Link>
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center justify-end space-x-4">
          {session?.user && (
            <div className="hidden items-center justify-end space-x-4 md:flex">
              <Link href="/glossary" className={buttonVariants({ variant: "link" })}>
                Thoth 2.0 Glossary
              </Link>
              <Link href="/pricing" className={buttonVariants({ variant: "link" })}>
                Membership
              </Link>
              <Link href="/readings" className={buttonVariants({ variant: "link" })}>
                My Readings
              </Link>
              <Link href="/" onClick={handleTarotClick} className={buttonVariants({ variant: "link" })}>
                Tarot
              </Link>
            </div>
          )}
          {session?.user && (
            <Sidebar>
              <React.Suspense fallback={<div className="flex-1 overflow-auto" />}>
                <SidebarList />
              </React.Suspense>
            </Sidebar>
          )}
        </div>
      </>
    </header>
  );
}
