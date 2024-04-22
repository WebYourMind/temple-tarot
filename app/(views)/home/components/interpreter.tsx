"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import "./cards.css";
import { SelectedCardType } from "./tarot-session";
import { ReadingTemplate } from "app/(views)/readings/[id]/reading";
import Loading from "components/loading";

export interface InterpreterProps extends React.ComponentProps<"div"> {
  query: string;
  cards: SelectedCardType[];
  spread: { name: string; value: string };
}

export function Interpreter({ query, cards, spread }: InterpreterProps) {
  // const { fetchCreditBalance } = useCredits();
  const [reading, setReading] = useState({
    userQuery: query,
    createdAt: new Date().toISOString(),
    cards,
    spreadType: spread.name,
    aiInterpretation: "",
  });

  const generateReading = useCallback(async (content) => {
    let isSubscribed = true;
    const controller = new AbortController();
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content, cards, userQuery: query, spreadType: spread.value }),
        signal: controller.signal,
      });

      if (!response.body) throw new Error("Failed to get the stream.");

      const reader = response.body.getReader();

      let receivedLength = 0;
      let chunks = [];
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          // setIsGenerating(false);
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
      .map((card, index) => `Position ${index + 1}: ${card.cardName} (${card.orientation})`)
      .join(", ");

    const content = `User's query: ${query}\n\nChosen spread: ${spread.name}\n\nChosen cards and their positions in the spread: ${cardDescriptions}`;
    generateReading(content);
  }, []);

  if (reading) {
    return <ReadingTemplate reading={reading} />;
  }
  return <Loading />;
}
