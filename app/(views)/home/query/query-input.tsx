import { CardStackIcon, PaperPlaneIcon } from "@radix-ui/react-icons";
import { Button } from "components/ui/button";
import { Label } from "components/ui/label";
import { Textarea } from "components/ui/textarea";
import { useState, useEffect } from "react";
import SpreadSelector from "./spread-selector";
import { useRouter } from "next/navigation";
import { cn } from "lib/utils";
import { Checkbox } from "components/ui/checkbox";
import CardInput from "./card-input";
import { useTarotSession } from "lib/contexts/tarot-session-context";
import { useUserAccessPlan } from "app/(ai-payments)/(frontend)/contexts/user-access-plan-context";
import DeckSelector from "./deck-selector";
import { InfoButton } from "components/info-dialog";
import Image from "next/image";

import { Quintessential } from "next/font/google";

import Logo from "../../../logo.png";
import { SendIcon, Settings2Icon, XIcon } from "lucide-react";
import TarotOptions from "./tarot-options";

const MagicFont = Quintessential({ subsets: ["latin"], weight: "400" });

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
    <div className="container mx-auto mb-10 flex h-full max-w-xl grow flex-col items-center justify-between space-y-8 px-4 md:mt-10">
      <div>
        <div className="mb-6 flex w-full justify-end">
          <div className="flex flex-col items-center space-y-2">
            <InfoButton type="query" className="ml-0" />
            <div className="-pr-8 relative w-full">
              <Button variant="ghost" className="p-0" onClick={() => setShowOptions(!showOptions)}>
                {showOptions ? <XIcon /> : <Settings2Icon />}
              </Button>
              {showOptions && (
                <div className="absolute right-0 top-10 w-screen bg-background p-0 py-2 pl-8">
                  <TarotOptions />
                </div>
              )}
            </div>
          </div>
        </div>
        {/* <Label htmlFor="question" className={cn("px-2 text-center font-sans text-xl md:px-0")}>
        What guidance are you seeking?
        <InfoButton type="query" />
      </Label> */}
        <Textarea
          id="question"
          name="question"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What is your heart's desire?"
          maxLength={5000}
          rows={4}
          autoFocus
          className={`border-0 bg-background p-0 font-sans text-4xl leading-relaxed tracking-wider caret-primary focus-visible:ring-offset-0`}
        />
      </div>
      <div>
        {showFreeReading && (
          <div className="space-y-0 text-center text-sm text-primary md:text-base">
            <p className="my-0">
              You have {freeReadings} free reading{freeReadings > 1 ? "s" : ""}!
            </p>
            {!emailVerified && <p className="my-0">Please verify your email to if you would like to use it.</p>}
          </div>
        )}
        {hasAccess ? (
          <Button onClick={handleSubmit} variant={"ghost"} disabled={(showCardInput && isSubmitDisabled) || !hasAccess}>
            CHOOSE CARDS <SendIcon className="ml-2" />
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
  );
};

export default QueryInput;
