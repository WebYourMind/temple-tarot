"use client";

import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import { DialogContent } from "components/ui/dialog";
import { cn } from "lib/utils";
import { MagicFont } from "components/tarot-session/query/query-input";

const CardInfo = ({ card, open, onOpenChange }) => {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <DialogContent className="fixed left-1/2 top-1/2 grid max-h-[90vh] w-[90%] -translate-x-1/2 -translate-y-1/2 transform grid-cols-2 overflow-scroll rounded-lg bg-background p-4 shadow-lg md:max-w-2xl md:p-6">
          <div className="col-span-2 mt-6 w-full items-center md:col-span-1 md:mt-0">
            <Image
              alt={card?.cardName}
              src={card?.imageUrl}
              width={256}
              height={384}
              className="h-auto w-full rounded-lg shadow-lg"
            />
          </div>
          <div className={cn("col-span-2 flex flex-col justify-between md:col-span-1", MagicFont.className)}>
            <div>
              <Dialog.Title className={"mt-0 text-3xl"}>{card?.cardName}</Dialog.Title>
              <Dialog.Description className="text-lg">{card?.suit}</Dialog.Description>
              <div className="space-y-6">
                <div>
                  {/* <p className="text-xl font-semibold">Summary</p> */}
                  <p className="font-sans">{card?.detail.paragraphSummary}</p>
                </div>
              </div>
            </div>
            <div className="mt-6 self-end text-right">
              <Dialog.Close>Close</Dialog.Close>
            </div>
          </div>
        </DialogContent>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default CardInfo;
