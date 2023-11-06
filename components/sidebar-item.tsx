"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "lib/utils";
import { buttonVariants } from "components/ui/button";

interface SidebarItemProps {
  menuItem: {
    path: string;
    name: string;
  };
}

export function SidebarItem({ menuItem }: SidebarItemProps) {
  const pathname = usePathname();
  const isActive = pathname === menuItem.path;

  if (!menuItem?.path) return null;

  return (
    <div className="relative">
      <Link
        href={menuItem.path}
        className={cn(buttonVariants({ variant: "ghost" }), "group w-full pl-8 pr-16", isActive && "bg-accent")}
      >
        <div
          className="relative max-h-5 flex-1 select-none overflow-hidden text-ellipsis break-all"
          title={menuItem.name}
        >
          <span className="whitespace-nowrap">{menuItem.name}</span>
        </div>
      </Link>
    </div>
  );
}
