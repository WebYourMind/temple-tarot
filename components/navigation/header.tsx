"use client";

import * as React from "react";
import { useState, useEffect } from "react";
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
// import { CreditBalance } from "../../app/(ai-payments)/(frontend)/components/credit-balance";
// import { LumenBalance } from "./lumen-balance";
import { cn } from "lib/utils";
// import FullscreenComponent from "app/(views)/home/components/fullscreen";

export default function Header() {
  const { data: session, status, update } = useSession() as any;
  const { setTheme, resolvedTheme } = useTheme();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [isScrolled, setIsScrolled] = useState(false);
  const scrollThreshold = 50;
  const bufferZone = 40;

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

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          if (scrollY > scrollThreshold + bufferZone) {
            setIsScrolled(true);
          } else if (scrollY < scrollThreshold - bufferZone) {
            setIsScrolled(false);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 flex w-full shrink-0 items-center justify-between bg-background px-4 transition-all",
        isScrolled ? "h-0" : "h-16"
      )}
    >
      {!isScrolled && (
        <>
          <div className="flex items-center">
            {session?.user ? (
              <Sidebar>
                <React.Suspense fallback={<div className="flex-1 overflow-auto" />}>
                  <SidebarList user={session.user} />
                </React.Suspense>
              </Sidebar>
            ) : (
              <Link href="/" className="mr-2 hover:no-underline">
                <h3 className={cn("mt-0 font-sans text-lg text-foreground")}>{appConfig.appName}</h3>
              </Link>
            )}
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
                {/* <LumenBalance />
                <CreditBalance /> */}
                <Link href="/glossary" className={buttonVariants({ variant: "link" })}>
                  Toth 2.0 Glossary
                </Link>
                <Link href="/pricing" className={buttonVariants({ variant: "link" })}>
                  Pricing
                </Link>
                <Link href="/readings" className={buttonVariants({ variant: "link" })}>
                  My Readings
                </Link>
                <Link href="/" onClick={handleTarotClick} className={buttonVariants({ variant: "link" })}>
                  Tarot
                </Link>
              </div>
            )}
            <Button
              variant="ghost"
              className="p-0"
              onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
              aria-label="Theme"
            >
              <Half2Icon />
            </Button>
            {/* <FullscreenComponent /> */}
          </div>
        </>
      )}
    </header>
  );
}
