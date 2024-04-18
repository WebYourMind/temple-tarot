"use client";

import { useEffect, useState } from "react";
import { useChat } from "ai/react";
import { toast } from "react-hot-toast";
import "./cards.css";
import ReactMarkdown from "react-markdown";
import { useCredits } from "lib/contexts/credit-context";
import Loading from "components/loading";

export interface InterpreterProps extends React.ComponentProps<"div"> {
  query: string;
  card: string;
  orientation: string;
}

export function Interpreter({ query, card, orientation }: InterpreterProps) {
  const { fetchCreditBalance } = useCredits();
  const [loading, setLoading] = useState(true);

  // Simulated API call setup, for later use
  const { messages, append } = useChat({
    body: {
      cardName: card,
      orientation,
      position: 1,
      userQuery: query,
      spreadType: "single_card",
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
    append({ role: "user", content: `User's query: ${query}\n\n Chosen card: ${card} ${orientation}` });
  }, []);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex flex-col">
        <p className="my-4 italic">{query}</p>
        <p className="my-3 text-lg">
          <strong>{card}</strong> - <strong>{orientation.charAt(0).toUpperCase() + orientation.slice(1)}</strong>
        </p>
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
