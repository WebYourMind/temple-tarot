import { Button, buttonVariants } from "components/ui/button";
import { Textarea } from "components/ui/textarea";
import { useState, memo } from "react";
import { useRouter } from "next/navigation";
import { useTarotSession } from "lib/contexts/tarot-session-context";
import { useUserAccessPlan } from "app/(ai-payments)/(frontend)/contexts/user-access-plan-context";
import { InfoButton } from "components/info-dialog";

import { Quicksand } from "next/font/google";

import { SendIcon, Settings2Icon } from "lucide-react";
import TarotOptions from "./tarot-options";
import { Dialog, DialogContent, DialogTrigger } from "components/ui/dialog";
import { cn } from "lib/utils";
import { Switch } from "components/ui/switch";
import { Label } from "components/ui/label";
import { Checkbox } from "components/ui/checkbox";
import CardInput from "./card-input";
import DeckSelector from "./deck-selector";
import SpreadSelector from "./spread-selector";

export const MagicFont = Quicksand({ subsets: ["latin"], weight: "400" });

const QueryInput = ({ placeholder, infoType, buttonText, handleSubmitQuery, isFollowUp }) => {
  const { query, setQuery, selectedCards, selectedDeck, spread, hasOwnCards } = useTarotSession();
  const { hasAccess, freeReadings, emailVerified, passExpiry, isSubscribed, isLoading } = useUserAccessPlan();
  const router = useRouter();
  const [drawCards, setDrawCards] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showCardInput, setShowCardInput] = useState();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(drawCards);
    handleSubmitQuery(drawCards);
  };

  const isSubmitDisabled = selectedCards?.some((selection) => selection.cardName === "") || (!query && !drawCards);
  const showFreeReading = !isSubscribed && (!passExpiry || new Date(passExpiry) < new Date()) && freeReadings > 0;

  const handleFocus = (event) => {
    event.target.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="mx-auto mb-10 flex h-full max-w-3xl grow flex-col items-center justify-between space-y-4 md:mt-10 md:justify-normal">
      <div className="flex h-full w-full flex-col justify-between pt-5">
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
              `h-full border-0 bg-transparent bg-opacity-30 px-0 pb-0 font-sans text-3xl font-bold leading-relaxed tracking-wider caret-primary placeholder:opacity-60 focus-visible:ring-offset-0 md:h-44 md:border md:px-2 md:text-xl`,
              MagicFont.className
            )}
          />
        </div>
        <div className="flex flex-col items-center justify-center">
          {/* isFollowUp && */}
          {
            <div className="my-4 flex w-full items-center justify-between space-x-2">
              <Label htmlFor="draw-cards-switch" className={cn("text-sm", MagicFont.className)}>
                {drawCards ? "Draw new cards" : "Ask without drawing new cards"}
              </Label>
              <Switch id="draw-cards-switch" checked={drawCards} onCheckedChange={(checked) => setDrawCards(checked)} />
            </div>
          }
          {drawCards && (
            <>
              <DeckSelector />
              <div className="flex w-full">
                <SpreadSelector />
                <InfoButton type="spread" />
              </div>
            </>
          )}
        </div>
        {/* <div>
          <div
            onClick={() => setShowSettings(true)}
            className={cn("mx-auto w-fit text-center text-xs", MagicFont.className)}
          >
            <p>{spread.name}</p>
            <p>{selectedDeck.name}</p>
            <p>{hasOwnCards ? "Physical Cards" : "Digital Cards"}</p>
          </div>
        </div> */}
      </div>
      <div className={cn("w-full", MagicFont.className)}>
        <div className="mb-4 flex w-full flex-col justify-center">
          <div className="flex items-center justify-between space-x-6">
            <div className="flex items-center">
              <InfoButton type={infoType} className="ml-0" />
              Info
            </div>
            <Dialog open={showSettings} onOpenChange={setShowSettings}>
              <DialogTrigger className={"flex items-center underline"}>Have your own deck?</DialogTrigger>
              <DialogContent className="my-16 max-h-[80vh] w-full max-w-xs overflow-scroll rounded-2xl px-4 py-4 md:max-w-2xl">
                <>
                  <div className="mt-8 flex justify-between pb-2">
                    <div
                      className={cn(
                        "flex w-full items-center justify-between rounded-md border border-foreground bg-background px-3 py-2",
                        // "w-full",
                        buttonVariants(),
                        showCardInput && "border-primary text-primary"
                      )}
                    >
                      <Checkbox
                        // className="hidden"
                        id="terms1"
                        checked={showCardInput}
                        onCheckedChange={setShowCardInput as () => void}
                      />
                      <div className="grid leading-none">
                        <label
                          htmlFor="terms1"
                          className={
                            "flex items-center text-sm peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          }
                        >
                          Use a Physical Deck
                        </label>
                      </div>

                      <Checkbox
                        // className="hidden"
                        id="terms1"
                        checked={showCardInput}
                        onCheckedChange={setShowCardInput as () => void}
                      />
                    </div>
                    <InfoButton type="physical" />
                  </div>
                  {showCardInput && <CardInput />}
                  {/* <TarotOptions /> */}
                </>
              </DialogContent>
            </Dialog>
          </div>
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
            <div className="flex w-full flex-col items-center">
              <Button onClick={handleSubmit} variant={"outline"} disabled={isSubmitDisabled || !hasAccess}>
                {buttonText} <SendIcon className="ml-2" />
              </Button>

              {!query && <p className="mb-0 mt-2 text-sm">(press start for an open reading)</p>}
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
      infoType="followup-query"
      buttonText="FOLLOW UP"
      handleSubmitQuery={handleSubmitFollowUpQuestion}
      isFollowUp={true}
    />
  );
};

export default memo(QueryInput);
