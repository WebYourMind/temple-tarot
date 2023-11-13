"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "lib/utils";
import { buttonVariants } from "components/ui/button";
import { SheetClose } from "components/ui/sheet";

interface SidebarItemProps {
  menuItem: {
    path: string;
    name: string;
    icon: React.ReactNode;
  };
}

export function SidebarItem({ menuItem }: SidebarItemProps) {
  const pathname = usePathname();
  const isActive = pathname === menuItem.path;

  if (!menuItem?.path) return null;

  return (
    <div className="relative">
      <SheetClose asChild>
        <Link
          href={menuItem.path}
          className={cn(buttonVariants({ variant: "ghost" }), "group w-full pl-4 pr-4", isActive && "bg-accent")}
        >
          <div
            className="relative flex max-h-5 flex-1 select-none flex-row items-center overflow-hidden text-ellipsis break-all"
            title={menuItem.name}
          >
            {menuItem.icon}
            <span className="ml-3">{menuItem.name}</span>
          </div>
        </Link>
      </SheetClose>
    </div>
  );
}
