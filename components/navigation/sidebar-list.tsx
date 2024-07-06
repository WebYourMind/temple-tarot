"use client";

import { EyeOpenIcon, MagicWandIcon, PersonIcon } from "@radix-ui/react-icons";
import { SidebarItem } from "./sidebar-item";
// import { LumenBalance } from "./lumen-balance";
// import { CreditBalance } from "../../app/(ai-payments)/(frontend)/components/credit-balance";
import { IconPlus } from "components/ui/icons";
import { signOut, useSession } from "next-auth/react";
import { BookOpenIcon, LogOutIcon } from "lucide-react";
import { buttonVariants } from "components/ui/button";
import Link from "next/link";
import { UserProfile } from "lib/types";

export function SidebarList({ user }: { user: UserProfile }) {
  const { data: session } = useSession() as any;

  const menuItems = [
    {
      name: "Tarot",
      path: "/",
      icon: <MagicWandIcon />,
    },
    {
      name: "My Readings",
      path: "/readings",
      icon: <EyeOpenIcon />,
    },
    {
      name: "Toth 2.0 Glossary",
      path: "/glossary",
      icon: <BookOpenIcon className="h-4 w-4" />,
    },
    {
      name: "My Profile",
      path: "/profile",
      icon: <PersonIcon />,
    },
    {
      name: session.user.isSubscribed ? "My Subscription" : "Pricing",
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
            {/* <div className="flex space-x-2 px-4">
            <LumenBalance />
            <CreditBalance />
          </div> */}
            {/* <div className="h-[1px] w-full bg-muted" /> */}
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
