import { DialogClose } from "@radix-ui/react-dialog";
import { Button } from "components/ui/button";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "components/ui/dialog";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function DeactivateAccount() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDeleteAccount = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch("/api/profile", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = (await res.json()) as { message: string; error: string };
      if (res.status === 200) {
        toast.success("Account successfully deleted.");
        signOut();
        router.push("/login");
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error("Failed to delete account:", error);
      setIsProcessing(false);
    }
  };
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Are you sure absolutely sure?</DialogTitle>
        <DialogDescription>
          This action cannot be undone. This will permanently delete your account and remove your data from our servers.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant={"secondary"} type="button" disabled={isProcessing}>
            Keep My Account
          </Button>
        </DialogClose>
        <Button variant={"destructive"} type="button" onClick={handleDeleteAccount} disabled={isProcessing}>
          {isProcessing ? "Deleting..." : "Delete My Account"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
