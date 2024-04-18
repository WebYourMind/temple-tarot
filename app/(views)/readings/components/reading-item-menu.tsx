"use client";

import { DotsVerticalIcon, ExclamationTriangleIcon } from "@radix-ui/react-icons";
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
  readingId: string;
};

function ReadingItemMenu({ readingId }: ReadingItemProps) {
  const { setReadings, readings } = useReadingsContext();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const handleDeleteSuccess = () => {
    setDeleteOpen(false);
    setReadings(readings.filter((reading) => reading.id !== readingId));
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
        <DeleteReading readingId={readingId} handleDeleteSuccess={handleDeleteSuccess} />
      </DialogPortal>
    </Dialog>
  );
}

export default ReadingItemMenu;
