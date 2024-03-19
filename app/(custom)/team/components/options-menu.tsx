"use client";

import { ChevronDownIcon } from "@radix-ui/react-icons";
import { Button } from "components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "components/ui/dropdown-menu";

type Props = {
  isAdmin: boolean;
  handleEdit: () => void;
  openDeleteDialog: () => void;
  openLeaveDialog: () => void;
};

export function OptionsMenu({ isAdmin, handleEdit, openDeleteDialog, openLeaveDialog }: Props) {
  return (
    <div className="flex items-center justify-between">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">
            Options
            <ChevronDownIcon className="ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent sideOffset={8} align="start" className="w-[180px] bg-background text-foreground">
          {isAdmin && (
            <DropdownMenuItem onClick={handleEdit} className="flex-col items-start">
              <div className="text-xs font-medium">Edit Info</div>
            </DropdownMenuItem>
          )}

          {isAdmin && (
            <>
              <DropdownMenuSeparator className="bg-primary" />
              <DropdownMenuItem onClick={openDeleteDialog}>
                <div className="text-xs font-medium">Delete Team</div>
              </DropdownMenuItem>
            </>
          )}

          {!isAdmin && (
            <DropdownMenuItem onClick={openLeaveDialog} className="flex-col items-start">
              <div className="text-xs font-medium">Leave Team</div>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
