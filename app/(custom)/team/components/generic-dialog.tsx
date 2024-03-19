"use client";

import { DialogClose } from "@radix-ui/react-dialog";
import { Button } from "components/ui/button";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "components/ui/dialog";

type GenericDialogProps = {
  title: string;
  description: string;
  actionLabel: string;
  cancelLabel: string;
  onAction: () => Promise<void>;
  isProcessing: boolean;
};

const GenericDialog = ({
  title,
  description,
  actionLabel,
  cancelLabel,
  onAction,
  isProcessing,
}: GenericDialogProps) => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant={"secondary"} type="button" disabled={isProcessing}>
            {cancelLabel}
          </Button>
        </DialogClose>
        <Button variant={"destructive"} type="button" onClick={onAction} disabled={isProcessing}>
          {isProcessing ? "Processing..." : actionLabel}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default GenericDialog;
