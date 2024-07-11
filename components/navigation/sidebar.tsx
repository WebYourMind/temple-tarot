"use client";

import * as React from "react";

import { Button } from "components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "components/ui/sheet";
import Logo from "app/logo.png";
import Image from "next/image";
import { MenuIcon } from "lucide-react";

export interface SidebarProps {
  children?: React.ReactNode;
}

export function Sidebar({ children }: SidebarProps) {
  return (
    <div>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="-ml-2 h-9 w-9 p-0">
            <MenuIcon className="h-6 w-6" />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
        </SheetTrigger>
        <SheetContent className="inset-y-0 flex h-auto w-[300px] flex-col bg-white/20 p-0 text-foreground backdrop-blur-md">
          <SheetHeader className="mb-4 p-4">
            <SheetTitle className="text-md tracking-wider">
              {/* {appConfig.appName} */}
              <Image src={Logo} width={200} height={100} alt="Temple Tarot" />
            </SheetTitle>
          </SheetHeader>
          {children}
        </SheetContent>
      </Sheet>
    </div>
  );
}
