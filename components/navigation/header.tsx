"use client";

import * as React from "react";
import Link from "next/link";

import { Button, buttonVariants } from "components/ui/button";
import { Sidebar } from "./sidebar";
import { UserMenu } from "./user-menu";
import { SidebarList } from "components/navigation/sidebar-list";
import { useSession } from "next-auth/react";
import appConfig from "app.config";
import { DividerVerticalIcon, Half2Icon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
// import { CreditBalance } from "./credit-balance";

export default function Header() {
  const { data: session, status } = useSession() as any;
  const { setTheme, resolvedTheme } = useTheme();
  const searchParams = useSearchParams();

  const createAuthUrl = (path: string) => {
    const currentPath = searchParams.get("redirect") || "/";
    return `${path}?redirect=${encodeURIComponent(currentPath)}`;
  };

  const registerUrl = createAuthUrl("/register");
  const loginUrl = createAuthUrl("/login");
  const pathname = usePathname();
  const router = useRouter();

  const handleTarotClick = (e) => {
    // Check if the target href is the same as the current pathname
    if (pathname === "/") {
      e.preventDefault(); // Prevent Link from navigating
      router.refresh(); // Reload the page
      router.push("/");
    }
  };

  return (
    <header className="sticky top-0 z-50 flex h-16 w-full shrink-0 items-center justify-between bg-background px-4">
      <div className="flex items-center">
        {session?.user ? (
          <Sidebar>
            <React.Suspense fallback={<div className="flex-1 overflow-auto" />}>
              <SidebarList />
            </React.Suspense>
          </Sidebar>
        ) : (
          <Link href="/" className="mr-2">
            {appConfig.appName}
          </Link>
        )}
        {status !== "loading" && (
          <div className="flex items-center">
            <DividerVerticalIcon className="h-6 w-6 text-border" />
            {session?.user ? (
              <UserMenu user={session.user} />
            ) : (
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
      <div className="hidden items-center justify-end space-x-4 md:flex">
        {session?.user && (
          <>
            {/* <CreditBalance />
            <Link href="/credits/get-credits" className={buttonVariants({ variant: "link" })}>
              Get Lumens
            </Link> */}
            <Link href="/readings" className={buttonVariants({ variant: "link" })}>
              My Readings
            </Link>
            <Link href="/" onClick={handleTarotClick} className={buttonVariants({ variant: "link" })}>
              Tarot
            </Link>
          </>
        )}
        <button onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")} aria-label="Theme">
          <Half2Icon />
        </button>
      </div>
    </header>
  );
}
