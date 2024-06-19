"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import "styles/cards.css";
import { useCredits } from "app/(ai-payments)/(frontend)/contexts/credit-context";
import { useLumens } from "lib/contexts/lumen-context";
import { useTarotSession } from "lib/contexts/tarot-session-context";
import { useRouter } from "next/navigation";
import { parseJsonSafe } from "lib/utils";
import ReadingLoading from "./reading-loading";
import TarotReadingSlides from "./tarot-reading-slides";

function Interpreter() {
  const {
    query,
    selectedCards: cards,
    spreadType: spread,
    interpretationArray,
    setInterpretationArray,
    selectedDeck,
    setPhase,
  } = useTarotSession();

  const router = useRouter();

  const { fetchCreditBalance } = useCredits();
  const { fetchLumenBalance } = useLumens();
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
      let interpretationValue = "";
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          setIsComplete(true);
          if (interpretationValue) {
            const intArray = parseJsonSafe(interpretationValue);
            if (Array.isArray(intArray)) {
              setInterpretationArray(intArray);
            }
          }
          fetchCreditBalance();
          fetchLumenBalance();
          break;
        }

        chunks.push(value);
        receivedLength += value.length;

        const chunk = new TextDecoder("utf-8").decode(value, { stream: true });
        if (isSubscribed) {
          interpretationValue += chunk;
        }
      }
    } catch (error: any) {
      if (isSubscribed) {
        console.error("Error generating reading: " + error.message);
        toast.error("Oops! Something went wrong. Please try again.");
      }
    }

    return () => {
      isSubscribed = false;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    setPhase("question");
    if (cards && !interpretationArray) {
      const cardDescriptions = cards
        .map(
          (card, index) =>
            `Position: ${index + 1}, position meaning: ${spread.cardMeanings[index]} \nCard drawn for this position: "${
              card.cardName
            }" (${card.orientation}) ${
              selectedDeck.value === "custom" &&
              `\nCard definition: ${card.readingTips} Upright guidance: ${card.uprightGuidance} Reversed guidance: ${card.reversedGuidance}`
            }\n\n`
        )
        .join(", ");

      let content = "";
      if (query) {
        content += `User's query: ${query}\n\n`;
      }
      content += `Selected Tarot Deck: ${selectedDeck.promptName}\n\n`;
      content += `Chosen spread: ${spread.name}\n\nCards drawn with their positions in the spread: ${cardDescriptions}`;

      if (!interpretationArray) {
        generateReading(content);
      }
    } else {
      router.replace("/");
    }
  }, [query, cards, spread]);

  if (interpretationArray) {
    return <TarotReadingSlides interpretation={interpretationArray} />;
  }

  return <ReadingLoading cards={cards} deckType={selectedDeck.value} />;
}

export default Interpreter;
