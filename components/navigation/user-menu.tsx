"use client";

import {
  signOut,
  // useSession
} from "next-auth/react";

import { Button } from "components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "components/ui/dropdown-menu";
import { UserProfile } from "lib/types";
import { IconUser } from "components/ui/icons";
import { manageSubscription } from "app/(ai-payments)/(frontend)/pricing/page";
// import toast from "react-hot-toast";

export interface UserMenuProps {
  user: UserProfile;
}

export function getUserInitials(name: string) {
  const [firstName, lastName] = name.split(" ");
  return lastName ? `${firstName[0]}${lastName[0]}` : firstName.slice(0, 2);
}

export function UserMenu({ user }: UserMenuProps) {
  return (
    <div className="flex items-center justify-between">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="link">
            <div className="flex h-7 w-7 shrink-0 select-none items-center justify-center rounded-full border border-foreground">
              <IconUser className="h-full w-full p-1" />
            </div>
            <span className="ml-2 hidden md:block">{user?.name}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent sideOffset={8} align="start" className="bg-background text-foreground">
          <DropdownMenuItem className="flex-col items-start">
            <div className="text-xs font-medium">{user?.name}</div>
            <div className="text-xs">{user?.email}</div>
          </DropdownMenuItem>
          {user.isSubscribed && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => manageSubscription()} className="text-xs">
                Manage Subscription
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() =>
              signOut({
                callbackUrl: "/",
              })
            }
            className="text-xs"
          >
            Log Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
