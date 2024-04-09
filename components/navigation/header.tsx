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
import { useTheme } from "app/theme";
import { useSearchParams } from "next/navigation";
import { CreditBalance } from "./credit-balance";

export function Header() {
  const { data: session, status } = useSession() as any;
  const { toggleTheme } = useTheme();
  const searchParams = useSearchParams();

  const createAuthUrl = (path: string) => {
    const currentPath = searchParams.get("redirect") || "/";
    return `${path}?redirect=${encodeURIComponent(currentPath)}`;
  };

  const registerUrl = createAuthUrl("/register");
  const loginUrl = createAuthUrl("/login");

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
        <CreditBalance />
        <Link href="/credits/get-credits" className={buttonVariants({ variant: "link" })}>
          Get Lumens
        </Link>
        <Link href="/" className={buttonVariants({ variant: "link" })}>
          Start Tarot
        </Link>
        <button onClick={toggleTheme} aria-label="Theme">
          <Half2Icon />
        </button>
      </div>
    </header>
  );
}
