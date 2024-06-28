"use client";

import { EyeOpenIcon, MagicWandIcon, PersonIcon } from "@radix-ui/react-icons";
import { SidebarItem } from "./sidebar-item";
// import { LumenBalance } from "./lumen-balance";
// import { CreditBalance } from "../../app/(ai-payments)/(frontend)/components/credit-balance";
import { IconPlus } from "components/ui/icons";
import { useSession } from "next-auth/react";
import { BookOpenIcon } from "lucide-react";
import { Button, buttonVariants } from "components/ui/button";
import Link from "next/link";

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
    name: "My Profile",
    path: "/profile",
    icon: <PersonIcon />,
  },
  {
    name: "Pricing",
    path: "/pricing",
    icon: <IconPlus />,
  },
  {
    name: "Toth 2.0 Glossary",
    path: "/glossary",
    icon: <BookOpenIcon className="h-4 w-4" />,
  },
];

export function SidebarList() {
  const { data: session } = useSession() as any;
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
            {menuItems.map((item) => item && <SidebarItem key={item?.path} menuItem={item} />)}
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
