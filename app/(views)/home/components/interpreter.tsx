import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import "./cards.css";
import { SelectedCardType } from "./tarot-session";
import Loading from "components/loading";
import { useCredits } from "app/(ai-payments)/(frontend)/contexts/credit-context";
import { useLumens } from "lib/contexts/lumen-context";
import FeedbackButtons from "./reading-feedback";
import { Button } from "components/ui/button";
import { IconClose } from "components/ui/icons";
import { Baskervville } from "next/font/google";
import { cn } from "lib/utils";

export const tarotFont = Baskervville({ weight: ["400"], subsets: ["latin"] });

export function Interpreter({ query, cards, spread, handleReset, selectedDeck }) {
  const { fetchCreditBalance } = useCredits();
  const { fetchLumenBalance } = useLumens();
  const [reading, setReading] = useState({
    userQuery: query,
    createdAt: new Date().toISOString(),
    cards,
    spread,
    spreadType: spread.name,
    aiInterpretation: "",
  });
  const [isComplete, setIsComplete] = useState(false);

  const generateReading = useCallback(async (content) => {
    let isSubscribed = true;
    const controller = new AbortController();
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content, cards, userQuery: query, spread, spreadType: spread.value }),
        signal: controller.signal,
      });

      if (!response.body) throw new Error("Failed to get the stream.");

      const reader = response.body.getReader();

      let receivedLength = 0;
      let chunks = [];
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          setIsComplete(true);
          fetchCreditBalance();
          fetchLumenBalance();
          break;
        }

        chunks.push(value);
        receivedLength += value.length;

        const chunk = new TextDecoder("utf-8").decode(value, { stream: true });
        if (isSubscribed) {
          setReading((prevReading) => ({ ...prevReading, aiInterpretation: prevReading.aiInterpretation + chunk }));
        }
      }
    } catch (error: any) {
      if (isSubscribed) {
        toast.error("Error generating reading: " + error.message);
      }
    }

    return () => {
      isSubscribed = false;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    const cardDescriptions = cards
      .map(
        (card, index) =>
          `Position: ${index + 1}, position meaning: ${spread.cardMeanings[index]} \nCard drawn for this position: ${
            card.cardName
          } (${card.orientation})\n\n`
      )
      .join(", ");

    let content = "";
    if (query) {
      content += `Seeker's query: ${query}\n\n`;
    }
    content += `Selected Tarot Deck: ${selectedDeck.promptName}\n\n`;
    content += `Chosen spread: ${spread.name}\n\nCards drawn with their positions in the spread: ${cardDescriptions}`;

    if (!reading.aiInterpretation) {
      generateReading(content);
    }
  }, [query, cards, spread]);

  if (reading.aiInterpretation) {
    return (
      <div className={cn("mx-auto max-w-2xl md:pb-16 md:pt-16", tarotFont.className)}>
        <div className="flex flex-col space-y-4 py-6 fade-in md:text-sm">
          <div className="opacity-70">
            <p>{new Date(reading.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="italic">
            <p>{reading?.userQuery || "Open Reading"}</p>
          </div>
          <div>
            <h3 className="text-sm font-bold">Cards:</h3>
            {reading.cards.map((card, index) => (
              <p key={card.cardName} className="mb-1">
                {index + 1}. {card.cardName} ({card.orientation.charAt(0).toUpperCase() + card.orientation.slice(1)})
              </p>
            ))}
          </div>
        </div>
        <div
          className={cn(
            "fade-in-text prose prose-indigo mx-auto mb-20 w-full max-w-full py-6 leading-relaxed text-foreground md:prose-lg md:text-lg",
            tarotFont.className
          )}
        >
          {/* formatted like a letter */}
          {reading.aiInterpretation.split(" ").map((word, index) => (
            <span key={index} className="whitespace-pre-wrap" style={{ opacity: 0 }}>
              {word}{" "}
            </span>
          ))}
        </div>
        {isComplete && <FeedbackButtons content={reading.aiInterpretation} />}
        {isComplete && (
          <div className="mt-10 flex justify-center fade-in">
            <Button
              variant="ghost"
              className="flex h-14 w-14 items-center justify-center rounded-full hover:text-primary"
              onClick={handleReset}
            >
              <IconClose className="h-20 w-20" />
            </Button>
          </div>
        )}
      </div>
    );
  }
  return <Loading />;
}
