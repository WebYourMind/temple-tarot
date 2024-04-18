import { Button, buttonVariants } from "components/ui/button";
// import { useCredits } from "lib/contexts/credit-context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "components/ui/dialog";
import Link from "next/link";
import { useState } from "react";
import Card from "./tarot-card";

const SpreadSelection = ({ onSpreadSelect }: { onSpreadSelect: (spread: string) => void }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  // const { credits } = useCredits();
  const handleChange = (value: string) => {
    // if (credits < 1) {
    //   setDialogOpen(true);
    // } else {
    onSpreadSelect(value);
    // }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center p-4">
        <h2 className="mb-8 text-lg font-semibold">Choose a spread</h2>
        <div className="grid gap-8 md:grid-cols-1">
          <Button
            onClick={() => handleChange("single")}
            className="flex h-full flex-col space-y-2 py-4 transition hover:scale-105"
          >
            <Card className="mb-2" />
            <span>Single Card</span>
          </Button>
          {/* <Button
            onClick={() => handleChange("three")}
            className="relative flex h-full w-[276px] grow flex-col items-center space-y-2 py-4 transition hover:scale-105"
            disabled
          >
            <div className="relative h-full w-full">
              <div className="absolute left-0 z-10 inline-block">
                <Card alt="Card 1" />
              </div>
              <div className="absolute left-0 z-20 inline-block translate-x-4 transform">
                <Card alt="Card 2" />
              </div>
              <div className="absolute left-0 z-30 inline-block translate-x-8 transform">
                <Card alt="Card 3" />
              </div>
            </div>
            <span>3 Card Spread</span>
            <span>(2 Lumens)</span>
          </Button> */}
        </div>
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>You don&apos;t have enough Lumens!</DialogTitle>
            <DialogDescription>But that&apos;s ok. You can get them by following the link below.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Link href="/credits/get-credits" className={buttonVariants()}>
              Get Lumens
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SpreadSelection;
