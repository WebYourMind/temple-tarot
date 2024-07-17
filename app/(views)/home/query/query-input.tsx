import { Button } from "components/ui/button";
import { Textarea } from "components/ui/textarea";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTarotSession } from "lib/contexts/tarot-session-context";
import { useUserAccessPlan } from "app/(ai-payments)/(frontend)/contexts/user-access-plan-context";
import { InfoButton } from "components/info-dialog";

import { Quicksand } from "next/font/google";

import { SendIcon, Settings2Icon } from "lucide-react";
import TarotOptions from "./tarot-options";
import { Dialog, DialogContent, DialogTrigger } from "components/ui/dialog";
import { cn } from "lib/utils";

export const MagicFont = Quicksand({ subsets: ["latin"], weight: "400" });

const QueryInput = () => {
  const { handleSubmitQuestion, selectedCards, setSelectedCards, setHasOwnCards, query, setQuery } = useTarotSession();
  const { hasAccess, freeReadings, emailVerified, passExpiry, isSubscribed } = useUserAccessPlan();
  const router = useRouter();
  // const router = useRouter();
  const [showCardInput, setShowCardInput] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSubmitQuestion();
  };

  useEffect(() => {
    setHasOwnCards(showCardInput);
    if (!showCardInput) {
      setSelectedCards(null);
    }
  }, [showCardInput]);

  const isSubmitDisabled = showCardInput && selectedCards?.some((selection) => selection.cardName === "");
  const showFreeReading = !isSubscribed && (!passExpiry || new Date(passExpiry) < new Date()) && freeReadings > 0;

  return (
    <div className="container mx-auto mb-10 flex h-full max-w-3xl grow flex-col items-center justify-between space-y-8 px-4 md:mt-10 md:justify-normal">
      <div className="w-full pt-20">
        <Textarea
          id="question"
          name="question"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What is your heart's desire?"
          maxLength={5000}
          rows={4}
          autoFocus
          className={cn(
            `h-full border-0 bg-transparent bg-opacity-30 px-2 pb-0 font-sans text-3xl font-bold leading-relaxed tracking-wider caret-primary placeholder:opacity-60 focus-visible:ring-offset-0 md:h-44 md:border md:text-xl`,
            MagicFont.className
          )}
        />
      </div>
      <div className="w-full">
        <div className="mb-4 flex w-full flex-col justify-center">
          <div className="flex items-center justify-between space-x-6">
            <div className="flex items-center">
              <InfoButton type="query" className="ml-0" />
              Info
            </div>
            <Dialog>
              <DialogTrigger className="flex items-center">
                <Settings2Icon className="mr-2" />
                Customize
              </DialogTrigger>
              <DialogContent className="my-16 max-h-[80vh] w-full max-w-xs overflow-scroll rounded-2xl px-4 py-4 md:max-w-2xl">
                <TarotOptions />
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="flex justify-center">
          {showFreeReading && (
            <div className="space-y-0 text-center text-sm text-primary md:text-base">
              <p className="my-0">
                You have {freeReadings} free reading{freeReadings > 1 ? "s" : ""}!
              </p>
              {!emailVerified && <p className="my-0">Please verify your email to if you would like to use it.</p>}
            </div>
          )}
          {hasAccess ? (
            <Button
              onClick={handleSubmit}
              variant={"outline"}
              disabled={(showCardInput && isSubmitDisabled) || !hasAccess}
            >
              START READING <SendIcon className="ml-2" />
            </Button>
          ) : (
            !showFreeReading && (
              <div className="text-center">
                <p>Sorry, you do not have an active pass or subscription.</p>
                <Button onClick={() => router.push("/pricing")} variant={"outline"}>
                  Go To Pricing
                </Button>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default QueryInput;
