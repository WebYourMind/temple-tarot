import * as React from "react";
import Link from "next/link";

import { cn } from "lib/utils";
import { Button, buttonVariants } from "components/ui/button";
import { Sidebar } from "./sidebar";
import { IconNextChat, IconSeparator } from "./ui/icons";
import { UserMenu } from "./user-menu";
import { getSession } from "lib/auth";
import { SidebarList } from "components/sidebar-list";

export async function Header() {
  const session = await getSession();
  return (
    <header className="sticky top-0 z-50 flex h-16 w-full shrink-0 items-center justify-between border-b bg-gradient-to-b from-background/10 via-background/50 to-background/80 px-4">
      <div className="flex items-center">
        {session?.user ? (
          <Sidebar>
            <React.Suspense fallback={<div className="flex-1 overflow-auto" />}>
              <SidebarList />
            </React.Suspense>
          </Sidebar>
        ) : (
          <Link href="/" target="_blank" rel="nofollow">
            <IconNextChat className="mr-2 h-6 w-6 dark:hidden" inverted />
            <IconNextChat className="mr-2 hidden h-6 w-6 dark:block" />
          </Link>
        )}
        <div className="flex items-center">
          <IconSeparator className="h-6 w-6 text-muted-foreground/50" />
          {session?.user ? (
            <UserMenu user={session.user} />
          ) : (
            <Button variant="link" asChild className="-ml-2">
              <Link href="/sign-in?callbackUrl=/">Login</Link>
            </Button>
          )}
        </div>
      </div>
      <div className="flex items-center justify-end space-x-2">
        <a href="shift.to" target="_blank" className={cn(buttonVariants())}>
          <span className="hidden sm:block">Shift Thinking</span>
          <span className="sm:hidden">Deploy</span>
        </a>
      </div>
    </header>
  );
}
