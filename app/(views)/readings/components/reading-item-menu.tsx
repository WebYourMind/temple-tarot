"use client";

import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { Dialog, DialogTrigger } from "components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "components/ui/dropdown-menu";
import DeleteReading from "./delete-reading";
import { useState } from "react";
import { DialogPortal } from "@radix-ui/react-dialog";
import { useReadingsContext } from "lib/contexts/readings-context";

type ReadingItemProps = {
  tarotSessionId: string;
};

function ReadingItemMenu({ tarotSessionId }: ReadingItemProps) {
  const { setTarotSessions, tarotSessions } = useReadingsContext();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const handleDeleteSuccess = () => {
    setDeleteOpen(false);
    setTarotSessions(tarotSessions.filter((tarotSession) => tarotSession.id !== tarotSessionId));
  };
  return (
    <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <DotsVerticalIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Options</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DialogTrigger asChild>
            <DropdownMenuItem>Delete Reading</DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogPortal>
        <DeleteReading tarotSessionId={tarotSessionId} handleDeleteSuccess={handleDeleteSuccess} />
      </DialogPortal>
    </Dialog>
  );
}

export default ReadingItemMenu;
