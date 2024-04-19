"use client";

import { useEffect, useState } from "react";
import { useChat } from "ai/react";
import { toast } from "react-hot-toast";
import "./cards.css";
import ReactMarkdown from "react-markdown";
import { useCredits } from "lib/contexts/credit-context";
import Loading from "components/loading";
import { SelectedCardType } from "./tarot-session";

export interface InterpreterProps extends React.ComponentProps<"div"> {
  query: string;
  cards: SelectedCardType[];
  spread: { name: string; value: string };
}

export function Interpreter({ query, cards, spread }: InterpreterProps) {
  const { fetchCreditBalance } = useCredits();
  const [loading, setLoading] = useState(true);

  // Simulated API call setup, for later use
  const { messages, append } = useChat({
    body: {
      cards,
      userQuery: query,
      spreadType: spread.value,
    },
    async onResponse(response) {
      setLoading(false);
      if (response.status === 401) {
        toast.error(response.statusText);
      }
    },
    async onFinish() {
      setTimeout(async () => {
        await fetchCreditBalance();
      }, 1000);
    },
  });

  useEffect(() => {
    const cardDescriptions = cards
      .map((card, index) => `Position ${index + 1}: ${card.cardName} (${card.orientation})`)
      .join(", ");

    const content = `User's query: ${query}\n\nChosen spread: ${spread.name}\n\nChosen cards and their positions in the spread: ${cardDescriptions}`;
    append({
      content,
      role: "user",
    });
  }, []);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex flex-col">
        <p className="my-4 italic">{query}</p>
        <p className="my-3">{spread.name} Spread</p>
        <div className="my-3 text-lg">
          {cards.map((card, index) => (
            <p key={card.cardName}>
              <strong>
                {index + 1}. {card.cardName} ({card.orientation.charAt(0).toUpperCase() + card.orientation.slice(1)})
              </strong>
            </p>
          ))}
        </div>
      </div>
      {loading && <Loading />}
      {messages.length > 0 &&
        messages.map(
          (message) =>
            message.role === "assistant" && (
              <ReactMarkdown
                key={message.content}
                className="prose prose-indigo mx-auto my-6 w-full max-w-full font-mono leading-relaxed text-foreground md:prose-lg"
              >
                {message.content}
              </ReactMarkdown>
            )
        )}
    </div>
  );
}
