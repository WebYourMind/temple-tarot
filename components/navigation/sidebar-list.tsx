"use client";

import { EyeOpenIcon, MagicWandIcon, PersonIcon } from "@radix-ui/react-icons";
import { SidebarItem } from "./sidebar-item";
import { IconPlus } from "components/ui/icons";
import { signOut } from "next-auth/react";
import { BookOpenIcon, LogOutIcon } from "lucide-react";
import { buttonVariants } from "components/ui/button";
import Link from "next/link";

export function SidebarList() {
  const menuItems = [
    {
      name: "Tarot",
      path: "/",
      icon: <MagicWandIcon />,
    },
    {
      name: "Past Readings",
      path: "/readings",
      icon: <EyeOpenIcon />,
    },
    {
      name: "Thoth 2.0 Glossary",
      path: "/glossary",
      icon: <BookOpenIcon className="h-4 w-4" />,
    },
    {
      name: "My Profile",
      path: "/profile",
      icon: <PersonIcon />,
    },
    {
      name: "Membership",
      path: "/pricing",
      icon: <IconPlus />,
    },
    {
      name: "Logout",
      onClick: () => signOut({ callbackUrl: "/" }),
      icon: <LogOutIcon className="h-4 w-4" />,
    },
  ];

  return (
    <div className="flex-1 overflow-auto">
      {menuItems?.length ? (
        <div className="flex h-full flex-col justify-between px-2 pb-2">
          <div className="space-y-4">
            {menuItems.map((item) => item && <SidebarItem key={item?.name} menuItem={item} />)}
          </div>
          <Link href="/privacy" className={buttonVariants({ variant: "link" })}>
            Privacy Policy
          </Link>
        </div>
      ) : (
        <div className="p-8 text-center">
          <p className="text-sm text-muted-foreground">No Menu</p>
        </div>
      )}
    </div>
  );
}
