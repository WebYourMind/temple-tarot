import { Button } from "components/ui/button";
import { Textarea } from "components/ui/textarea";
import { useState, memo } from "react";
import { useRouter } from "next/navigation";
import { useTarotSession } from "lib/contexts/tarot-session-context";
import { useUserAccessPlan } from "app/(ai-payments)/(frontend)/contexts/user-access-plan-context";
import { InfoButton } from "components/info-dialog";

import { Quicksand } from "next/font/google";

import { SendIcon } from "lucide-react";

import { cn } from "lib/utils";
import { Switch } from "components/ui/switch";
import { Label } from "components/ui/label";
import TarotPreferences from "./tarot-preferences";

export const MagicFont = Quicksand({ subsets: ["latin"], weight: "400" });

const QueryInput = ({ placeholder, infoType, buttonText, handleSubmitQuery, isFollowUp }) => {
  const { query, setQuery, selectedCards, hasOwnCards } = useTarotSession();
  const { hasAccess, freeReadings, emailVerified, passExpiry, isSubscribed, isLoading } = useUserAccessPlan();
  const router = useRouter();
  const [drawCards, setDrawCards] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSubmitQuery(drawCards);
  };

  const isSubmitDisabled =
    (hasOwnCards && selectedCards?.some((selection) => selection.cardName === "")) || (!query && !drawCards);
  const showFreeReading = !isSubscribed && (!passExpiry || new Date(passExpiry) < new Date()) && freeReadings > 0;

  const handleFocus = (event) => {
    event.target.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="mx-auto flex h-full w-full max-w-lg flex-col items-center justify-between space-y-4 px-2 md:mt-10 md:justify-center">
      <div className="flex h-full w-full flex-col justify-between space-y-4 md:justify-center">
        <div className="flex w-full items-center justify-end">
          <InfoButton type={infoType} className="mr-0 p-0" />
        </div>
        <div>
          <Textarea
            id="question"
            name="question"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            maxLength={5000}
            rows={4}
            onFocus={handleFocus}
            autoFocus
            className={cn(
              `mt-0 h-full border-0 bg-transparent bg-opacity-30 px-0 pb-0 pt-0 font-sans text-3xl font-bold leading-relaxed tracking-wider caret-primary placeholder:opacity-60 focus-visible:ring-offset-0 md:h-44 md:border md:px-2 md:text-xl`,
              MagicFont.className
            )}
          />
        </div>
        <div className="flex flex-col items-center justify-center">
          {isFollowUp && (
            <div className="my-4 flex w-full items-center justify-between space-x-2 px-1">
              <Label htmlFor="draw-cards-switch" className={cn("text-sm", MagicFont.className)}>
                Draw new cards
              </Label>
              <Switch id="draw-cards-switch" checked={drawCards} onCheckedChange={(checked) => setDrawCards(checked)} />
            </div>
          )}
          <TarotPreferences drawCards={drawCards} />
        </div>
      </div>
      <div className={cn("w-full", MagicFont.className)}>
        <div className="flex h-full flex-col justify-center">
          {showFreeReading && (
            <div className="mb-2 mt-0 space-y-0 text-center text-sm text-primary md:text-base">
              <p className="mb-0">
                You have {freeReadings} free reading{freeReadings > 1 ? "s" : ""} ✨
              </p>
              {!emailVerified && <p className="mb-0">Please verify your email to use it.</p>}
            </div>
          )}
          {hasAccess ? (
            <div className="mb-4 flex h-full w-full flex-col items-center">
              <Button onClick={handleSubmit} variant={"outline"} disabled={isSubmitDisabled || !hasAccess}>
                {buttonText} <SendIcon className="ml-2" />
              </Button>

              {!query && !isSubmitDisabled && (
                <p className="mt-2 text-sm">(press {isFollowUp ? "follow-up" : "start"} for an open reading)</p>
              )}
            </div>
          ) : (
            !showFreeReading &&
            !isLoading && (
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

// Higher-order component for new reading
export const NewReadingInput = () => {
  const { handleSubmitQuestion } = useTarotSession();
  return (
    <QueryInput
      placeholder="What guidance are you seeking?"
      infoType="query"
      buttonText="START"
      handleSubmitQuery={handleSubmitQuestion}
      isFollowUp={false}
    />
  );
};

// Higher-order component for follow-up reading
export const FollowUpReadingInput = () => {
  const { handleSubmitFollowUpQuestion } = useTarotSession();
  return (
    <QueryInput
      placeholder="What do you seek to clarify or explore further?"
      infoType="query"
      buttonText="FOLLOW UP"
      handleSubmitQuery={handleSubmitFollowUpQuestion}
      isFollowUp={true}
    />
  );
};

export default memo(QueryInput);
