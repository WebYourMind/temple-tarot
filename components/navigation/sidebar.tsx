"use client";

import * as React from "react";

import { Button } from "components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "components/ui/sheet";
import { MenuIcon } from "lucide-react";
import { cn } from "lib/utils";
import { MagicFont } from "components/tarot-flow/query/query-input";
import LogoComponent from "./logo-component";

export interface SidebarProps {
  children?: React.ReactNode;
}

export function Sidebar({ children }: SidebarProps) {
  return (
    <div>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9 p-0">
            <MenuIcon className="h-6 w-6" />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
        </SheetTrigger>
        <SheetContent className="inset-y-0 flex h-auto w-[300px] flex-col bg-white/20 p-0 text-foreground backdrop-blur-md">
          <SheetHeader className="mb-4 p-4">
            <SheetTitle className={cn("text-2xl tracking-wider", MagicFont.className)}>
              <LogoComponent />
            </SheetTitle>
          </SheetHeader>
          {children}
        </SheetContent>
      </Sheet>
    </div>
  );
}
