"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import "styles/cards.css";
import { useTarotFlow } from "lib/contexts/tarot-flow-context";
import { useRouter } from "next/navigation";
import ReadingLoading from "./reading-loading";
import TarotReadingSlides from "./tarot-reading-slides";
import InterpretationSlide from "./interpretation-slide";
import { useUserAccessPlan } from "app/(payments)/(frontend)/contexts/user-access-plan-context";

function Interpreter({ tarotSessionId = null, proppedTarotSession = null }) {
  const defaultSession = useTarotFlow();
  const { freeReadings, setFreeReadings } = useUserAccessPlan();
  const [error, setError] = useState<string>();

  const { query, selectedCards, spread, selectedDeck, isFollowUp, followUpContext, usersName } =
    proppedTarotSession || defaultSession;

  const { aiResponse, setAiResponse, onResponseComplete, addAiResponseToReading } = defaultSession;
  const router = useRouter();
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (isComplete && freeReadings >= 1) {
      setFreeReadings(freeReadings - 1);
    }
    if (isComplete && addAiResponseToReading) {
      addAiResponseToReading(aiResponse);
    }
  }, [isComplete, addAiResponseToReading, aiResponse]);

  const generateReading = useCallback(async (content) => {
    let isSubscribed = true;
    const controller = new AbortController();
    try {
      const response = await fetch("/api/readings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          cards: selectedCards,
          userQuery: query,
          spread,
          tarotSessionId,
          followUpContext,
          deck: selectedDeck.value,
          usersName: usersName,
        }),
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
          if (interpretationValue) {
            setAiResponse(interpretationValue);
          }
          setIsComplete(true);
          break;
        }

        chunks.push(value);
        receivedLength += value.length;

        const chunk = new TextDecoder("utf-8").decode(value, { stream: true });
        if (isSubscribed) {
          setAiResponse((prevState) => (prevState ? prevState + chunk : chunk));
        }
      }
    } catch (error: any) {
      setError(error);
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

  // calls generate reading on mount if there's selected cards and no exisisting aiResponse
  useEffect(() => {
    if (onResponseComplete) {
      const reading = {
        aiInterpretation: aiResponse,
        cards: selectedCards,
        userQuery: query,
        proppedTarotSession: { query, selectedCards, spread, selectedDeck, isFollowUp, followUpContext, usersName },
      };
      onResponseComplete(reading);
    } else if (selectedCards && !aiResponse) {
      const cardDescriptions = selectedCards
        .map(
          (card, index) =>
            `\nPosition: ${index + 1}, position meaning: ${spread.cardMeanings[index]} Card name: "${
              card.cardName
            }", orientation:(${card.orientation}) ${
              selectedDeck.value === "thoth_2"
                ? `\nCard definition: ${card.detail.readingTips} Upright guidance: ${card.detail.uprightGuidance} Reversed guidance: ${card.detail.reversedGuidance}`
                : "."
            }`
        )
        .join(", ");

      const content = `${query || "Open Reading"}
      Please use this Tarot Deck: ${selectedDeck.promptName}
      Please use this spread: ${spread.name}
      The cards I pulled with their positions in the spread are: ${cardDescriptions}`;

      generateReading(content);
    } else if (isFollowUp && !aiResponse) {
      const content = `User's follow up query based on previous readings: ${query}`;
      generateReading(content);
    } else if (!proppedTarotSession) {
      router.replace("/");
    }
  }, [query, selectedCards, spread]);

  if (error) {
    return <p>{error}</p>;
  }

  if (isFollowUp && aiResponse) {
    return <InterpretationSlide query={query} cards={selectedCards} aiResponse={aiResponse} />;
  }

  if (aiResponse) {
    return <TarotReadingSlides tarotSessionId={tarotSessionId} />;
  }

  return <ReadingLoading cards={selectedCards} deckType={selectedDeck.value} />;
}

export default Interpreter;
