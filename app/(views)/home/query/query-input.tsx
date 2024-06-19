import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { Button } from "components/ui/button";
import { Label } from "components/ui/label";
import { Textarea } from "components/ui/textarea";
import { useState, useEffect } from "react";
import SpreadSelector from "./spread-selector";
import { useCredits } from "app/(ai-payments)/(frontend)/contexts/credit-context";
// import { useRouter } from "next/navigation";
import { cn } from "lib/utils";
import { Checkbox } from "components/ui/checkbox";
import CardInput from "./card-input";
import { useTarotSession } from "lib/contexts/tarot-session-context";
import DeckSelector from "./deck-selector";
import { infoMap } from "lib/tarot-data/info";
import { InfoButton } from "components/info-dialog";

const QueryInput = () => {
  const {
    handleSubmitQuestion,
    selectedCards,
    setSelectedCards,
    setHasOwnCards,
    query,
    setQuery,
    setShowInfo,
    setInfoContent,
  } = useTarotSession();
  const { credits } = useCredits();
  // const router = useRouter();
  const [showCardInput, setShowCardInput] = useState(false);

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

  return (
    <div className="container mx-auto flex h-full max-w-xl flex-col items-center justify-center space-y-8 px-2 md:mt-10">
      <Label htmlFor="question" className={cn("mb-2 px-2 text-center font-sans text-xl md:px-0")}>
        What guidance are you seeking?
        <InfoButton type="query" />
      </Label>
      <Textarea
        id="question"
        name="question"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Write about it here (or leave blank for an open reading)..."
        maxLength={5000}
        rows={4}
        autoFocus
      />
      <DeckSelector />
      <div className="flex">
        <SpreadSelector />
        <InfoButton type="spread" />
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="terms1" checked={showCardInput} onCheckedChange={setShowCardInput as () => void} />
        <div className="grid leading-none">
          <label
            htmlFor="terms1"
            className="flex items-center text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            I have a physical deck
            <InfoButton type="physical" />
          </label>
        </div>
      </div>
      {showCardInput && <CardInput />}
      <Button
        onClick={handleSubmit}
        variant={"ghost"}
        disabled={!credits || credits === 0 || (showCardInput && isSubmitDisabled)}
      >
        SEND <PaperPlaneIcon className="ml-2" />
      </Button>
      {/* {credits === 0 && (
        <div className="text-center">
          <p>You do not have enough credits!</p>
          <Button onClick={() => router.push("/pricing")} variant={"outline"}>
            Get Credits
          </Button>
        </div>
      )} */}
    </div>
  );
};

export default QueryInput;
