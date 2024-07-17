"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "lib/utils";
import { Button, buttonVariants } from "components/ui/button";
import { SheetClose } from "components/ui/sheet";

interface SidebarItemProps {
  menuItem: {
    path?: string;
    name: string;
    icon: React.ReactNode;
    onClick?: () => void;
  };
}

function MenuContents({ menuItem }: SidebarItemProps) {
  return (
    <div
      className="relative flex max-h-5 flex-1 select-none flex-row items-center overflow-hidden text-ellipsis break-all"
      title={menuItem.name}
    >
      {menuItem.icon}
      <span className="ml-3">{menuItem.name}</span>
    </div>
  );
}

export function SidebarItem({ menuItem }: SidebarItemProps) {
  const pathname = usePathname();
  const isActive = pathname === menuItem.path;

  if (!menuItem?.path && !menuItem?.onClick) return null;

  return (
    <div className="relative">
      <SheetClose asChild>
        {menuItem.onClick ? (
          <Button
            onClick={menuItem.onClick}
            className={cn(
              isActive ? buttonVariants({ variant: "outline" }) : buttonVariants({ variant: "outline" }),
              "group w-full appearance-none bg-transparent pl-4 pr-4"
            )}
          >
            <MenuContents menuItem={menuItem} />
          </Button>
        ) : (
          <Link
            href={menuItem.path}
            className={cn(
              isActive ? buttonVariants({ variant: "default" }) : buttonVariants({ variant: "outline" }),
              "group w-full appearance-none pl-4 pr-4"
            )}
          >
            <MenuContents menuItem={menuItem} />
          </Link>
        )}
      </SheetClose>
    </div>
  );
}
