import { Button } from "components/ui/button";
import { Textarea } from "components/ui/textarea";
import { useState, memo } from "react";
import { useRouter } from "next/navigation";
import { useTarotFlow } from "lib/contexts/tarot-flow-context";
import { useUserAccessPlan } from "app/(payments)/(frontend)/contexts/user-access-plan-context";
import { InfoButton } from "components/info-dialog";

import { Quicksand } from "next/font/google";

import { cn } from "lib/utils";
import { Switch } from "components/ui/switch";
import { Label } from "components/ui/label";
import TarotPreferences from "./tarot-preferences";

export const MagicFont = Quicksand({ subsets: ["latin"], weight: "400" });

const QueryInput = ({ placeholder, infoType, buttonText, handleSubmitQuery, isFollowUp }) => {
  const { query, setQuery, selectedCards, hasOwnCards, storeLastUsedDeck, storeLastUsersName } = useTarotFlow();
  const { hasAccess, freeReadings, emailVerified, passExpiry, isSubscribed, isLoading } = useUserAccessPlan();
  const router = useRouter();
  const [drawCards, setDrawCards] = useState(true);
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    storeLastUsedDeck();
    storeLastUsersName();
    handleSubmitQuery(drawCards);
  };

  const isSubmitDisabled =
    (hasOwnCards && selectedCards?.some((selection) => selection.cardName === "")) || (!query && !drawCards);
  const showFreeReading = !isSubscribed && (!passExpiry || new Date(passExpiry) < new Date()) && freeReadings > 0;

  const handleFocus = (event) => {
    event.target.scrollIntoView({ behavior: "smooth", block: "center" });
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div
      className={cn(
        "p-pwa mx-auto flex h-full w-full max-w-lg grow flex-col items-center justify-between space-y-4 px-3 md:justify-center",
        isFollowUp && "min-h-fill"
      )}
    >
      <div className="flex w-full flex-col justify-start space-y-4 md:mb-10 md:justify-center">
        <div className="flex w-full items-center justify-end text-sm text-opacity-50">
          <InfoButton type={infoType} className="mr-2 p-0">
            More info
          </InfoButton>
        </div>
        <div className="relative">
          <Textarea
            id="question"
            name="question"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder + (!query && !drawCards ? "*" : "")}
            maxLength={5000}
            rows={4}
            autoFocus
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={cn(
              `caret mt-0 h-full border-0 bg-transparent bg-opacity-30 px-1 pb-0 pt-0 font-sans text-3xl font-bold leading-relaxed tracking-wider caret-primary placeholder:opacity-60 focus-visible:ring-offset-0 md:h-44 md:border md:p-2 md:text-xl`,
              MagicFont.className
            )}
          />
          {!isFocused && !query && (
            <span className="caret-blink absolute -top-2 left-0 font-sans text-4xl font-thin leading-relaxed text-primary md:hidden">
              |
            </span>
          )}
        </div>
      </div>
      <div className={cn("w-full md:max-w-xs", MagicFont.className)}>
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
        <div className="flex flex-col justify-center">
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
              <Button
                onClick={handleSubmit}
                variant={"outline"}
                className={cn("border-2 px-8")}
                disabled={isSubmitDisabled || !hasAccess}
              >
                {buttonText}
              </Button>

              {!query && !isSubmitDisabled && (
                <p className="mt-2 text-sm">(press {isFollowUp ? "follow-up" : "start"} for an open reading)</p>
              )}
            </div>
          ) : (
            !showFreeReading &&
            !isLoading && (
              <div className="mb-4 text-center">
                <p>Sorry, you do not have an active subscription.</p>
                <Button className={cn("border-2 px-8")} onClick={() => router.push("/pricing")} variant={"outline"}>
                  Subscribe
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
  const { handleSubmitQuestion } = useTarotFlow();
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
  const { handleSubmitFollowUpQuestion } = useTarotFlow();
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
