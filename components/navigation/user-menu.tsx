"use client";

import { signOut, useSession } from "next-auth/react";

import { Button } from "components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "components/ui/dropdown-menu";
import { UserProfile } from "lib/types";

export interface UserMenuProps {
  user: UserProfile;
}

export function getUserInitials(name: string) {
  const [firstName, lastName] = name.split(" ");
  return lastName ? `${firstName[0]}${lastName[0]}` : firstName.slice(0, 2);
}

export function UserMenu({ user }: UserMenuProps) {
  const { update } = useSession();

  async function upgradeUser() {
    if (user) {
      const res = await fetch(`/api/upgrade/?userId=${user.id}`, { method: "PATCH" });
      if (res.ok) {
        update({ role: "admin" });
      }
    }
  }

  return (
    <div className="flex items-center justify-between">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">
            <div className="flex h-7 w-7 shrink-0 select-none items-center justify-center rounded-full bg-muted text-xs font-medium uppercase text-foreground">
              {user?.name ? getUserInitials(user?.name) : null}
            </div>
            <span className="ml-2">{user?.name}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent sideOffset={8} align="start" className="w-[180px] bg-background text-foreground">
          <DropdownMenuItem className="flex-col items-start">
            <div className="text-xs font-medium">{user?.name}</div>
            <div className="text-xs text-zinc-500">{user?.email}</div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => upgradeUser()} className="text-xs">
            Upgrade
          </DropdownMenuItem>
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
