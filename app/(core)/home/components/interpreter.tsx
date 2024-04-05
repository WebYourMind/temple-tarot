"use client";

import { useEffect } from "react";
import { useChat } from "ai/react";
import { toast } from "react-hot-toast";
import "./cards.css";
import ReactMarkdown from "react-markdown";

export interface InterpreterProps extends React.ComponentProps<"div"> {
  query: string;
  card: string;
  orientation: string;
}

export function Interpreter({ query, card, orientation }: InterpreterProps) {
  // Simulated API call setup, for later use
  const { messages, append } = useChat({
    onResponse(response) {
      if (response.status === 401) {
        toast.error(response.statusText);
      }
    },
  });

  useEffect(() => {
    append({ role: "user", content: `User's query: ${query}\n\n Chosen card: ${card} ${orientation}` });
  }, []);

  return (
    <>
      <div className="mt-4 flex justify-center">
        <p>
          Your card is: <strong>{card}</strong> and it&apos;s <strong>{orientation}</strong>.
        </p>
      </div>
      {messages.length > 0 &&
        messages.map(
          (message) =>
            message.role === "assistant" && (
              <ReactMarkdown
                key={message.content}
                className="prose prose-indigo mx-auto mt-10 w-full font-mono text-foreground md:prose-lg"
              >
                {message.content}
              </ReactMarkdown>
            )
        )}
    </>
  );
}
