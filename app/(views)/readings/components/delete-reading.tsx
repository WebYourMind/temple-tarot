import { DialogClose } from "@radix-ui/react-dialog";
import { Button } from "components/ui/button";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "components/ui/dialog";
import { useState } from "react";
import toast from "react-hot-toast";

export default function DeleteReading({
  tarotSessionId,
  handleDeleteSuccess,
}: {
  tarotSessionId: string;
  handleDeleteSuccess: () => void;
}) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDeleteReading = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch("/api/tarot-sessions", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tarotSessionId }),
      });

      const data = (await res.json()) as { message: string; error: string };
      if (res.status === 200) {
        toast.success("Reading deleted.");
        handleDeleteSuccess();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error("Failed to delete reading:", error);
      setIsProcessing(false);
    }
  };
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogDescription>This action cannot be undone and will permanently delete your reading.</DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant={"secondary"} type="button" disabled={isProcessing}>
            Cancel
          </Button>
        </DialogClose>
        <Button variant={"destructive"} type="button" onClick={handleDeleteReading} disabled={isProcessing}>
          {isProcessing ? "Deleting..." : "Delete"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
