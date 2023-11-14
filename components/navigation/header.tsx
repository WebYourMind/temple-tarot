import * as React from "react";
import Link from "next/link";

import { cn } from "lib/utils";
import { Button, buttonVariants } from "components/ui/button";
import { Sidebar } from "./sidebar";
import { IconSeparator } from "../ui/icons";
import { UserMenu } from "./user-menu";
import { getSession } from "lib/auth";
import { SidebarList } from "components/navigation/sidebar-list";

export async function Header() {
  const session = await getSession();
  return (
    <header className="sticky top-0 z-50 flex h-16 w-full shrink-0 items-center justify-between border-b bg-white px-4">
      <div className="flex items-center">
        {session?.user ? (
          <Sidebar>
            <React.Suspense fallback={<div className="flex-1 overflow-auto" />}>
              <SidebarList />
            </React.Suspense>
          </Sidebar>
        ) : (
          <Link href="/" target="_blank" rel="nofollow" className="mr-1">
            Merlin AI
          </Link>
        )}
        <div className="flex items-center">
          <IconSeparator className="h-6 w-6 text-muted-foreground/50" />
          {session?.user ? (
            <UserMenu user={session.user} />
          ) : (
            <>
              <Button variant="link" asChild className="-ml-2">
                <Link href="/sign-in?callbackUrl=/">Login</Link>
              </Button>

              <Button variant="link" asChild className="-ml-2">
                <Link href="/register">Register</Link>
              </Button>
            </>
          )}
        </div>
      </div>
      <div className="flex items-center justify-end space-x-2">
        <a href="https://shift.to" target="_blank" className={cn(buttonVariants())}>
          <span className="hidden sm:block">Shift Thinking</span>
          <span className="sm:hidden">shift.to</span>
        </a>
      </div>
    </header>
  );
}
