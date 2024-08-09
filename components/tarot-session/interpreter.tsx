"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import "styles/cards.css";
import { useTarotSession } from "lib/contexts/tarot-session-context";
import { useRouter } from "next/navigation";
import { parseJsonSafe } from "lib/utils";
import ReadingLoading from "../../app/(views)/interpretation/reading-loading";
import TarotReadingSlides from "./tarot-reading-slides";
import InterpretationSlide from "./interpretation-slide";
import { customDeck } from "lib/tarot-data/tarot-deck";

function Interpreter({ tarotSessionId = null, proppedTarotSession = null }) {
  const defaultSession = useTarotSession();

  const { query, selectedCards, spread, selectedDeck, isFollowUp } = proppedTarotSession || defaultSession;

  const {
    interpretationArray,
    setInterpretationArray,
    setPhase,
    aiResponse,
    setAiResponse,
    onResponseComplete,
    followUpContext,
  } = defaultSession;
  const router = useRouter();
  const [isComplete, setIsComplete] = useState(false);

  // useEffect(() => {
  //   if (onResponseComplete && isComplete) {
  //     const reading = {
  //       aiInterpretation: aiResponse,
  //       cards: selectedCards,
  //       userQuery: query,
  //     };
  //     onResponseComplete(reading);
  //   }
  // }, [isComplete]);

  const generateReading = useCallback(async (content) => {
    let isSubscribed = true;
    const controller = new AbortController();
    try {
      const response = await fetch("/api/chat", {
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
            const intArray = parseJsonSafe(interpretationValue);
            if (Array.isArray(intArray)) {
              setInterpretationArray(intArray);
            } else {
              console.log(aiResponse);
              setAiResponse(interpretationValue);
            }
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
      console.log({ query, selectedCards, spread, selectedDeck, isFollowUp });
      const reading = {
        aiInterpretation: aiResponse,
        cards: selectedCards,
        userQuery: query,
        proppedTarotSession: { query, selectedCards, spread, selectedDeck, isFollowUp },
      };
      onResponseComplete(reading);
    } else if (selectedCards && !aiResponse) {
      console.log(selectedDeck);
      console.log(customDeck[0]);
      const cardDescriptions = selectedCards
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

      const content = `Query: ${query || "Open Reading"}
      Chosen Tarot Deck: ${selectedDeck.promptName}
      Chosen spread: ${spread.name}
      Cards drawn with their positions in the spread: ${cardDescriptions}`;

      generateReading(content);
    } else if (isFollowUp && !aiResponse) {
      const content = `User's follow up query based on previous readings: ${query}`;
      generateReading(content);
    } else if (!proppedTarotSession) {
      router.replace("/");
    }
  }, [query, selectedCards, spread]);

  if (isFollowUp && (interpretationArray || aiResponse)) {
    console.log("is follow up");
    return <InterpretationSlide cards={selectedCards} selectedDeck={selectedDeck} aiResponse={aiResponse} />;
  }

  if (interpretationArray || aiResponse) {
    console.log("not follow up");
    return <TarotReadingSlides tarotSessionId={tarotSessionId} />;
  }
  console.log(selectedCards);
  // if (!selectedCards) {
  //   router.replace("/");
  // }

  return <ReadingLoading cards={selectedCards} deckType={selectedDeck.value} />;
}

export default Interpreter;
